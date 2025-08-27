import { getAllInquiries } from '@/lib/inquiries.js';
import { initializeProductionData } from '@/lib/init-production-data.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import InquiryActions from './InquiryActions';

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
            <Card key={inquiry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inquiry.name || 'Unnamed'}</CardTitle>
                    <p className="text-sm text-gray-600">{inquiry.email || 'No email'}</p>
                    {inquiry.company && <p className="text-sm text-gray-600">{inquiry.company}</p>}
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      inquiry.status === 'new' ? 'default' : 
                      inquiry.status === 'accepted' ? 'secondary' : 
                      'destructive'
                    }>
                      {inquiry.status || 'unknown'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inquiry.services && Array.isArray(inquiry.services) && inquiry.services.length > 0 && (
                    <div>
                      <strong>Services:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {inquiry.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service || 'Unknown Service'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {inquiry.description && (
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {inquiry.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {inquiry.phone && (
                      <div>
                        <strong>Phone:</strong> {inquiry.phone}
                      </div>
                    )}
                    {(inquiry.budgetLow || inquiry.budgetHigh) && (
                      <div>
                        <strong>Budget:</strong> 
                        {inquiry.budgetLow && inquiry.budgetHigh 
                          ? `$${inquiry.budgetLow} - $${inquiry.budgetHigh}`
                          : inquiry.budgetLow 
                            ? `$${inquiry.budgetLow}+`
                            : `Up to $${inquiry.budgetHigh}`
                        }
                      </div>
                    )}
                    {inquiry.budget && !inquiry.budgetLow && !inquiry.budgetHigh && (
                      <div>
                        <strong>Budget:</strong> {inquiry.budget}
                      </div>
                    )}
                    {inquiry.desiredDate && (
                      <div>
                        <strong>Desired Date:</strong> {inquiry.desiredDate}
                      </div>
                    )}
                    {inquiry.templateId && (
                      <div>
                        <strong>Template:</strong> 
                        <Link href={`/templates/${inquiry.templateId}`} className="text-blue-600 hover:text-blue-700 ml-1">
                          {inquiry.templateId}
                        </Link>
                      </div>
                    )}
                    {inquiry.hasExistingSystem && (
                      <div>
                        <strong>Has Existing System:</strong> Yes
                        {inquiry.filePath && (
                          <div className="text-xs text-blue-600 mt-1">
                            File: {inquiry.filePath}
                          </div>
                        )}
                      </div>
                    )}
                    {inquiry.website && (
                      <div>
                        <strong>Website:</strong> {inquiry.website}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/inquiries/${inquiry.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>

                    {inquiry.filePath && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Link href={`/api/files/${inquiry.filePath.replace('uploads/', '')}`} target="_blank">
                            <Download className="h-4 w-4 mr-1" />
                            Download File
                          </Link>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="text-green-600 hover:text-blue-700"
                        >
                          <Link href={`/api/files/${inquiry.filePath.replace('uploads/', '')}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview File
                          </Link>
                        </Button>
                      </>
                    )}

                    {/* Interactive Action Buttons */}
                    <InquiryActions inquiry={inquiry} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 