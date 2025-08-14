import { NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple';
import { getTemplateById, updateTemplate, deleteTemplate } from '@/lib/templates';
import { revalidatePath } from 'next/cache';
import { UpdateTemplateSchema } from '@/types/template.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await requireAdminNode(request);
    const template = await getTemplateById(params.id);
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    return NextResponse.json(template);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdminNode(request);
    const body = await request.json();
    
    // Validate with zod schema
    const validationResult = UpdateTemplateSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Add updatedAt timestamp
    const updateData = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    const updatedTemplate = await updateTemplate(params.id, updateData);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/templates');
    revalidatePath('/admin/templates');
    revalidatePath(`/templates/${params.id}`);
    
    return NextResponse.json({ ok: true, template: updatedTemplate });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdminNode(request);
    const body = await request.json();
    
    // Validate with zod schema
    const validationResult = UpdateTemplateSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Add updatedAt timestamp
    const updateData = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    const updatedTemplate = await updateTemplate(params.id, updateData);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/templates');
    revalidatePath('/admin/templates');
    revalidatePath(`/templates/${params.id}`);
    
    return NextResponse.json({ ok: true, template: updatedTemplate });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdminNode(request);
    await deleteTemplate(params.id);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/templates');
    revalidatePath('/admin/templates');
    revalidatePath(`/templates/${params.id}`);
    
    return NextResponse.json({ ok: true, message: 'Template deleted successfully' });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 