import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries } from '@/lib/inquiries.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    console.log('Fetching all inquiries');
    
    const inquiries = await getAllInquiries();
    
    console.log(`Successfully fetched ${inquiries.length} inquiries`);
    
    return new Response(
      JSON.stringify(inquiries),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch inquiries',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 