import { NextRequest, NextResponse } from 'next/server';
import inquiriesService from '../../../../../lib/services/inquiries.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    console.log(`📊 Fetching inquiry: ${params.id}`);
    
    const inquiry = await inquiriesService.getById(params.id);
    
    if (!inquiry) {
      return new Response(
        JSON.stringify({ error: 'Inquiry not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify(inquiry),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Error fetching inquiry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch inquiry',
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
    
    console.log(`🔄 Updating inquiry ${id} with:`, updates);
    
    const updatedInquiry = await inquiriesService.update(id, updates);
    
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
    console.error('❌ Error updating inquiry:', error);
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
    
    console.log(`🗑️ Deleting inquiry ${id}`);
    
    const success = await inquiriesService.delete(id);
    
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
    console.error('❌ Error deleting inquiry:', error);
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