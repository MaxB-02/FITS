import { NextRequest, NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple.js';
import { getInquiryById, updateInquiry, deleteInquiry } from '@/lib/inquiries.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const user = await requireAdminNode(request);
    
    const inquiry = await getInquiryById(params.id);
    
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json(inquiry);
    
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await requireAdminNode(request);
    
    const updates = await request.json();
    const updatedInquiry = await updateInquiry(params.id, updates);
    
    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedInquiry);
    
  } catch (error) {
    console.error('Error updating inquiry:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAdminNode(request);
    
    const success = await deleteInquiry(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Inquiry deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
} 