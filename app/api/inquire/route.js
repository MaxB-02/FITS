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
    const dataDir = process.env.DATA_DIR || 'data';
    const uploadsDirRoot = process.env.UPLOADS_DIR || 'uploads';

    // Check if this is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      // Extract file if present
      const file = formData.get('file');
      if (file && file instanceof File) {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.isAbsolute(uploadsDirRoot)
          ? uploadsDirRoot
          : path.join(process.cwd(), uploadsDirRoot);
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
        filePath = `${uploadsDirRoot.replace(/\/$/, '')}/${fileName}`;
        
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
      try {
        inquiryData = await request.json();
        
        // Ensure templateId is included
        if (!inquiryData.templateId) {
          inquiryData.templateId = null;
        }
      } catch (parseError) {
        console.error('Error parsing JSON request:', parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON data' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Basic validation
    if (!inquiryData.name || !inquiryData.email || !inquiryData.description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, description' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Budget validation
    if (inquiryData.budgetLow && inquiryData.budgetHigh && 
        parseFloat(inquiryData.budgetLow) > parseFloat(inquiryData.budgetHigh)) {
      return new Response(
        JSON.stringify({ error: 'Budget high must be greater than or equal to budget low' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
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
      console.log('Environment variables:');
      console.log('- DATA_DIR:', process.env.DATA_DIR);
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      
      const leadsPath = path.isAbsolute(dataDir)
        ? path.join(dataDir, 'leads.json')
        : path.join(process.cwd(), dataDir, 'leads.json');
      const leads = await readJSON(leadsPath);
      console.log('Current leads count:', leads.length);
      console.log('Adding new inquiry:', inquiry);
      
      leads.push(inquiry);
      await writeJSON(leadsPath, leads);
      
      console.log('Successfully saved inquiry to local database');
      console.log('New leads count:', leads.length);
      
      // Revalidate admin paths to ensure new inquiries appear immediately
      revalidatePath('/admin');
      revalidatePath('/admin/inquiries');
      
    } catch (error) {
      console.error('Error saving inquiry:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Try fallback: save to /tmp if primary location fails
      try {
        console.log('🔄 Trying fallback: saving to /tmp directory');
        const fallbackPath = '/tmp/leads.json';
        let fallbackLeads = [];
        
        try {
          fallbackLeads = await readJSON(fallbackPath);
        } catch (readError) {
          console.log('📝 Creating new fallback leads file');
        }
        
        fallbackLeads.push(inquiry);
        await writeJSON(fallbackPath, fallbackLeads);
        
        console.log('✅ Successfully saved inquiry to fallback location:', fallbackPath);
        
        // Revalidate admin paths
        revalidatePath('/admin');
        revalidatePath('/admin/inquiries');
        
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to save inquiry to database';
        if (error.code === 'EACCES') {
          errorMessage = 'Permission denied: Cannot write to database directory';
        } else if (error.code === 'ENOSPC') {
          errorMessage = 'No space left on device';
        } else if (error.code === 'EROFS') {
          errorMessage = 'Read-only file system: Cannot write to database';
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            details: error.message,
            code: error.code,
            fallbackError: fallbackError.message
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
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

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry.id
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing inquiry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process inquiry',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 