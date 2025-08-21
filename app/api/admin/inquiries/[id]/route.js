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

export async function POST(request, { params }) {
  try {
    const user = await requireAdminNode(request);
    
    const formData = await request.formData();
    const status = formData.get('status');
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    
    const updates = { status };
    const updatedInquiry = await updateInquiry(params.id, updates);
    
    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    
    // Redirect back to the inquiries page
    return NextResponse.redirect(new URL('/admin/inquiries', request.url));
    
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

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    console.log(`Updating inquiry ${id} with:`, updates);
    
    const updatedInquiry = await updateInquiry(id, updates);
    
    if (!updatedInquiry) {
      return new Response(
        JSON.stringify({ error: 'Inquiry not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        inquiry: updatedInquiry 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update inquiry',
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
    
    console.log(`Deleting inquiry ${id}`);
    
    const success = await deleteInquiry(id);
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Inquiry not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inquiry deleted successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete inquiry',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 