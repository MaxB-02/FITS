import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import inquiriesService from '../../../lib/services/inquiries.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    console.log('🚀 Processing new inquiry submission...');
    
    let inquiryData;
    let filePath = null;
    
    // Check if this is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      console.log('📁 Processing multipart form data with file upload');
      
      // Handle file upload
      const formData = await request.formData();
      
      // Extract file if present
      const file = formData.get('file');
      if (file && file instanceof File) {
        console.log('📎 Processing file upload:', file.name);
        
        // Create uploads directory
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
        
        console.log(`✅ File uploaded successfully: ${uploadPath}`);
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
      
      console.log('📝 Extracted form data:', {
        name: inquiryData.name,
        email: inquiryData.email,
        services: inquiryData.services,
        hasFile: !!filePath
      });
      
    } else {
      console.log('📝 Processing JSON form data');
      
      // Handle JSON data
      try {
        inquiryData = await request.json();
        
        // Ensure templateId is included
        if (!inquiryData.templateId) {
          inquiryData.templateId = null;
        }
      } catch (parseError) {
        console.error('❌ Error parsing JSON request:', parseError);
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
      console.log('❌ Missing required fields');
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
      console.log('❌ Invalid email format');
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
      console.log('❌ Invalid budget range');
      return new Response(
        JSON.stringify({ error: 'Budget high must be greater than or equal to budget low' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Validation passed, creating inquiry...');

    // Create inquiry using the new service
    const inquiry = await inquiriesService.create(inquiryData);
    
    console.log('✅ Inquiry created successfully:', inquiry.id);

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
        
        console.log('✅ Email notification sent successfully');
      } catch (error) {
        console.error('❌ Error sending email notification:', error);
      }
    }

    // Check if this is a fetch/AJAX request
    const acceptHeader = request.headers.get('accept') || '';
    const isAjaxRequest = acceptHeader.includes('application/json') || 
                         request.headers.get('x-requested-with') === 'XMLHttpRequest';

    if (isAjaxRequest) {
      console.log('📱 Returning JSON response for AJAX request');
      // Return JSON response for AJAX requests
      return new Response(
        JSON.stringify({ 
          success: true,
          id: inquiry.id,
          message: 'Inquiry submitted successfully'
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.log('🌐 Redirecting to thank you page for form submission');
      // Redirect to thank you page for form submissions
      return new Response(null, {
        status: 303,
        headers: { 'Location': '/thank-you' }
      });
    }

  } catch (error) {
    console.error('💥 Error processing inquiry:', error);
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