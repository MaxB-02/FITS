import { NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple';
import { getProjectById, updateProject, deleteProject } from '@/lib/portfolio';
import { revalidatePath } from 'next/cache';
import { UpdatePortfolioSchema } from '@/types/portfolio.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await requireAdminNode(request);
    const project = await getProjectById(params.id);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
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
    const validationResult = UpdatePortfolioSchema.safeParse(body);
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
      active: validatedData.active !== undefined ? validatedData.active : true,
      updatedAt: new Date().toISOString()
    };
    
    const updatedProject = await updateProject(params.id, updateData);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath(`/portfolio/${params.id}`);
    
    return NextResponse.json({ ok: true, project: updatedProject });
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
    await deleteProject(params.id);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath(`/portfolio/${params.id}`);
    
    return NextResponse.json({ ok: true, message: 'Project deleted successfully' });
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