import { NextRequest, NextResponse } from 'next/server';
import { requireAdminNode } from '@/lib/auth-simple.js';
import { deleteInquiry } from '@/lib/inquiries.js';

export const runtime = 'nodejs';

export async function POST(request, { params }) {
  try {
    const user = await requireAdminNode(request);
    
    // Extract the ID from the URL path
    const id = params.id;
    
    const success = await deleteInquiry(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    // Redirect back to the inquiries page
    return NextResponse.redirect(new URL('/admin/inquiries', request.url));
    
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
