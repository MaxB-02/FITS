import { NextRequest, NextResponse } from 'next/server';
import { getAllTemplates, createTemplate } from '@/lib/templates.js';
import { CreateTemplateSchema } from '@/types/template.js';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    console.log('Fetching all templates');
    
    const templates = await getAllTemplates();
    
    console.log(`Successfully fetched ${templates.length} templates`);
    
    return new Response(
      JSON.stringify(templates),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error fetching templates:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch templates',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Creating new template with data:', body);
    
    // Validate the template data
    const validationResult = CreateTemplateSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          issues: validationResult.error.issues 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check for duplicate ID
    const existingTemplates = await getAllTemplates();
    const duplicateId = existingTemplates.find(t => t.id === body.id);
    if (duplicateId) {
      return new Response(
        JSON.stringify({ 
          error: 'Template ID already exists',
          message: `A template with ID "${body.id}" already exists. Please choose a different ID.`
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create the template
    const newTemplate = await createTemplate({
      ...body,
      active: body.active !== undefined ? body.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Template created successfully:', newTemplate);
    
    // Revalidate all relevant paths
    revalidatePath('/admin');
    revalidatePath('/admin/templates');
    revalidatePath('/templates');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        template: newTemplate 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error creating template:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create template',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 