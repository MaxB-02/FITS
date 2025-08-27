import { getAllInquiries } from '@/lib/inquiries.js';
import { initializeProductionData } from '@/lib/init-production-data.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import InteractiveInquiryCard from './InteractiveInquiryCard';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  // Initialize production data if needed
  try {
    await initializeProductionData();
  } catch (error) {
    console.log('Production data initialization skipped or failed:', error.message);
  }

  // Fetch inquiries directly
  let inquiries = [];
  try {
    inquiries = await getAllInquiries();
    console.log('Inquiries loaded:', inquiries?.length || 0);
  } catch (error) {
    console.error('Failed to load inquiries:', error);
    inquiries = [];
  }

  // Ensure we have an array
  if (!Array.isArray(inquiries)) {
    inquiries = [];
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Inquiries</h1>
            <p className="text-muted-foreground">
              Review and manage all project inquiries
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/portfolio">
              <Button variant="outline">Portfolio</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {inquiries.length} inquiries
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No inquiries found.</p>
            <p className="text-sm text-gray-500 mt-2">
              Inquiries will appear here when customers submit project requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InteractiveInquiryCard 
              key={inquiry.id} 
              inquiry={inquiry} 
              formatDate={formatDate}
              onUpdate={(updatedInquiry) => {
                // This will be handled by the client component
                console.log('Inquiry updated:', updatedInquiry);
              }}
              onDelete={(deletedId) => {
                // This will be handled by the client component
                console.log('Inquiry deleted:', deletedId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 