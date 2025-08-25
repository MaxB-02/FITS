import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById, updateTemplate, deleteTemplate } from '@/lib/templates.js';
import { UpdateTemplateSchema } from '@/types/template.js';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const template = await getTemplateById(params.id);
    
    if (!template) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify(template),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error fetching template:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch template',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log(`Updating template ${id} with:`, updates);
    
    // Validate the update data
    const validationResult = UpdateTemplateSchema.safeParse(updates);
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
    
    // Add updatedAt timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const updatedTemplate = await updateTemplate(id, updateData);
    
    if (!updatedTemplate) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Revalidate all relevant paths
    revalidatePath('/admin');
    revalidatePath('/admin/templates');
    revalidatePath('/templates');
    revalidatePath(`/templates/${id}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        template: updatedTemplate 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error updating template:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update template',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    console.log(`Deleting template ${id}`);
    
    const success = await deleteTemplate(id);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Revalidate all relevant paths
    revalidatePath('/admin');
    revalidatePath('/admin/templates');
    revalidatePath('/templates');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Template deleted successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error deleting template:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete template',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 