import { NextRequest, NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple.js';
import { getAllTemplates, createTemplate } from '@/lib/templates.js';
import { revalidatePath } from 'next/cache';
import { CreateTemplateSchema } from '@/types/template.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await requireAdminNode(request); // Authenticate
    const templates = await getAllTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requireAdminNode(request); // Authenticate
    
    const body = await request.json();
    console.log('POST /api/admin/templates - Received body:', body);
    
    // Validate with zod schema
    const validationResult = CreateTemplateSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('POST /api/admin/templates - Validation failed:', validationResult.error.errors);
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    console.log('POST /api/admin/templates - Validated data:', validatedData);
    
    // Check for duplicate ID
    const existingTemplates = await getAllTemplates();
    console.log('POST /api/admin/templates - Existing templates count:', existingTemplates.length);
    
    if (existingTemplates.find(t => t.id === validatedData.id)) {
      console.log('POST /api/admin/templates - Duplicate ID found:', validatedData.id);
      return NextResponse.json(
        { error: 'Template with this ID already exists' },
        { status: 409 }
      );
    }
    
    // Set default active to false if not provided and add timestamps
    const templateData = {
      ...validatedData,
      active: validatedData.active !== undefined ? validatedData.active : false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    console.log('POST /api/admin/templates - Creating template with data:', templateData);
    
    const newTemplate = await createTemplate(templateData);
    console.log('POST /api/admin/templates - Template created successfully:', newTemplate);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/templates');
    revalidatePath('/admin/templates');
    revalidatePath(`/templates/${newTemplate.id}`);
    
    return NextResponse.json({ 
      ok: true, 
      id: newTemplate.id,
      template: newTemplate 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/templates - Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      error: 'Failed to create template',
      details: error.message 
    }, { status: 500 });
  }
} 