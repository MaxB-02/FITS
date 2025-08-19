import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    // Construct the file path from the URL parameters
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'uploads', filePath);
    
    // Security check: ensure the path is within the uploads directory
    const normalizedPath = path.normalize(fullPath);
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (!normalizedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Check if file exists
    try {
      await fs.access(normalizedPath);
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(normalizedPath);
    
    // Determine content type based on file extension
    const ext = path.extname(normalizedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.csv':
        contentType = 'text/csv';
        break;
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case '.xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case '.ods':
        contentType = 'application/vnd.oasis.opendocument.spreadsheet';
        break;
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(normalizedPath)}"`,
      },
    });
    
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
} 