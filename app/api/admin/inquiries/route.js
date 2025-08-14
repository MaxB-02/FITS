import { NextRequest, NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple.js';
import { getAllInquiries, createInquiry } from '@/lib/inquiries.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const user = await requireAdminNode(request);
    
    const inquiries = await getAllInquiries();
    return NextResponse.json(inquiries);
    
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAdminNode(request);
    
    const data = await request.json();
    const inquiry = await createInquiry(data);
    
    return NextResponse.json(inquiry, { status: 201 });
    
  } catch (error) {
    console.error('Error creating inquiry:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
} 