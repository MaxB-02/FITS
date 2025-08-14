import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth-nextauth.js';
import { getAllProjects, createProject } from '@/lib/portfolio.js';
import { revalidatePath } from 'next/cache';
import { CreatePortfolioSchema } from '@/types/portfolio.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await requireAdminAuth(request); // Authenticate with NextAuth
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requireAdminAuth(request); // Authenticate with NextAuth
    
    const body = await request.json();
    console.log('POST /api/admin/portfolio - Received body:', body);
    
    // Validate with zod schema
    const validationResult = CreatePortfolioSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('POST /api/admin/portfolio - Validation failed:', validationResult.error.errors);
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    console.log('POST /api/admin/portfolio - Validated data:', validatedData);
    
    // Check for duplicate ID
    const existingProjects = await getAllProjects();
    console.log('POST /api/admin/portfolio - Existing projects count:', existingProjects.length);
    
    if (existingProjects.find(p => p.id === validatedData.id)) {
      console.log('POST /api/admin/portfolio - Duplicate ID found:', validatedData.id);
      return NextResponse.json(
        { error: 'Project with this ID already exists' },
        { status: 409 }
      );
    }
    
    // Add timestamps
    const projectData = {
      ...validatedData,
      active: validatedData.active !== undefined ? validatedData.active : true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    console.log('POST /api/admin/portfolio - Creating project with data:', projectData);
    
    const newProject = await createProject(projectData);
    console.log('POST /api/admin/portfolio - Project created successfully:', newProject);
    
    // Revalidate paths to ensure public pages update
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath(`/portfolio/${newProject.id}`);
    
    return NextResponse.json({ 
      ok: true, 
      id: newProject.id,
      project: newProject 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/portfolio - Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      error: 'Failed to create portfolio project',
      details: error.message 
    }, { status: 500 });
  }
} 