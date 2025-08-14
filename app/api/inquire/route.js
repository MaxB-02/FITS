import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { readJSON, writeJSON } from '@/lib/file-db.js';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    let inquiryData;
    let filePath = null;

    // Check if this is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      // Extract file if present
      const file = formData.get('file');
      if (file && file instanceof File) {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        
        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const extension = path.extname(originalName);
        const fileName = `inquiry-${timestamp}${extension}`;
        const uploadPath = path.join(uploadsDir, fileName);
        
        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(uploadPath, buffer);
        
        // Store relative path for database
        filePath = `uploads/${fileName}`;
        
        console.log(`File uploaded successfully: ${uploadPath}`);
      }
      
      // Extract other form data
      const services = [];
      for (const [key, value] of formData.entries()) {
        if (key === 'services') {
          services.push(value);
        }
      }
      
      inquiryData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        services: services,
        description: formData.get('description'),
        hasExistingSystem: formData.get('hasExistingSystem') === 'on',
        filePath: filePath,
        budgetLow: formData.get('budgetLow') ? parseFloat(formData.get('budgetLow')) : undefined,
        budgetHigh: formData.get('budgetHigh') ? parseFloat(formData.get('budgetHigh')) : undefined,
        desiredDate: formData.get('desiredDate'),
        templateId: formData.get('templateId') || null
      };
    } else {
      // Handle JSON data
      inquiryData = await request.json();
      
      // Ensure templateId is included
      if (!inquiryData.templateId) {
        inquiryData.templateId = null;
      }
    }

    // Basic validation
    if (!inquiryData.name || !inquiryData.email || !inquiryData.description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, description' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryData.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Budget validation
    if (inquiryData.budgetLow && inquiryData.budgetHigh && 
        parseFloat(inquiryData.budgetLow) > parseFloat(inquiryData.budgetHigh)) {
      return NextResponse.json(
        { error: 'Budget high must be greater than or equal to budget low' },
        { status: 400 }
      );
    }

    // Generate unique ID and timestamp
    const id = `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    // Create inquiry object
    const inquiry = {
      id,
      createdAt,
      ...inquiryData,
      status: 'new'
    };

    // Save to leads.json
    try {
      console.log('Attempting to save inquiry to leads.json');
      console.log('Current working directory:', process.cwd());
      
      const leads = await readJSON('data/leads.json');
      console.log('Current leads count:', leads.length);
      console.log('Adding new inquiry:', inquiry);
      
      leads.push(inquiry);
      await writeJSON('data/leads.json', leads);
      
      console.log('Successfully saved inquiry to local database');
      console.log('New leads count:', leads.length);
      
      // Revalidate admin paths to ensure new inquiries appear immediately
      revalidatePath('/admin');
      revalidatePath('/admin/inquiries');
      
    } catch (error) {
      console.error('Error saving inquiry:', error);
      return NextResponse.json(
        { error: 'Failed to save inquiry to database' },
        { status: 500 }
      );
    }

    // Send email notification (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'noreply@freakinthesheets.com',
          to: process.env.NOTIFICATION_EMAIL || 'admin@freakinthesheets.com',
          subject: `New Project Inquiry: ${inquiry.name}`,
          html: `
            <h2>New Project Inquiry</h2>
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
            ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
            <p><strong>Description:</strong> ${inquiry.description}</p>
            ${inquiry.budgetLow || inquiry.budgetHigh ? `<p><strong>Budget:</strong> $${inquiry.budgetLow || '0'} - $${inquiry.budgetHigh || 'Unlimited'}</p>` : ''}
            ${inquiry.hasExistingSystem ? `<p><strong>Has Existing System:</strong> Yes</p>` : ''}
            ${inquiry.filePath ? `<p><strong>File Uploaded:</strong> ${inquiry.filePath}</p>` : ''}
            ${inquiry.desiredDate ? `<p><strong>Desired Date:</strong> ${inquiry.desiredDate}</p>` : ''}
            ${inquiry.templateId ? `<p><strong>Template ID:</strong> ${inquiry.templateId}</p>` : ''}
          `
        });
        
        console.log('Email notification sent successfully');
      } catch (error) {
        console.error('Error sending email notification:', error);
      }
    }

    // Redirect to thank-you page
    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      inquiryId: inquiry.id
    });

  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json({ 
      error: 'Failed to process inquiry',
      details: error.message 
    }, { status: 500 });
  }
} 