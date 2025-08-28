import inquiriesService from '@/lib/services/inquiries.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import InquiryActions from './InquiryActions';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  let inquiries = [];
  
  try {
    inquiries = await inquiriesService.getAll();
    console.log('✅ Admin inquiries page loaded:', inquiries?.length || 0);
  } catch (error) {
    console.error('❌ Failed to load inquiries:', error);
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
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatBudget = (low, high) => {
    if (!low && !high) return 'Not specified';
    if (low && high) return `$${low} - $${high}`;
    if (low) return `$${low}+`;
    if (high) return `Up to $${high}`;
    return 'Not specified';
  };

  if (inquiries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Manage Inquiries</h1>
            <p className="text-muted-foreground mb-8">
              No inquiries found. Inquiries will appear here when customers submit project requests.
            </p>
            <div className="bg-muted/50 rounded-lg p-8">
              <p className="text-sm text-muted-foreground">
                When customers submit inquiries through the form, they will appear here for you to review and manage.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Inquiries</h1>
          <p className="text-muted-foreground">
            Review and manage project inquiries from customers. You can accept, decline, or delete inquiries as needed.
          </p>
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} data-inquiry-id={inquiry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {inquiry.name || 'Unnamed Customer'}
                    </CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Email:</strong> {inquiry.email || 'No email'}</p>
                      {inquiry.company && (
                        <p><strong>Company:</strong> {inquiry.company}</p>
                      )}
                      {inquiry.phone && (
                        <p><strong>Phone:</strong> {inquiry.phone}</p>
                      )}
                      <p><strong>Submitted:</strong> {formatDate(inquiry.createdAt)}</p>
                      {inquiry.budgetLow || inquiry.budgetHigh ? (
                        <p><strong>Budget:</strong> {formatBudget(inquiry.budgetLow, inquiry.budgetHigh)}</p>
                      ) : null}
                      {inquiry.desiredDate && (
                        <p><strong>Desired Date:</strong> {inquiry.desiredDate}</p>
                      )}
                      {inquiry.templateId && (
                        <p><strong>Template:</strong> {inquiry.templateId}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <Badge 
                      variant={
                        inquiry.status === 'new' ? 'default' : 
                        inquiry.status === 'accepted' ? 'secondary' : 
                        'destructive'
                      }
                      className="status-badge"
                    >
                      {inquiry.status || 'unknown'}
                    </Badge>
                    
                    {inquiry.reviewedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Reviewed: {formatDate(inquiry.reviewedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Services */}
                  {inquiry.services && inquiry.services.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Services Needed:</h4>
                      <div className="flex flex-wrap gap-2">
                        {inquiry.services.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Description */}
                  {inquiry.description && (
                    <div>
                      <h4 className="font-medium mb-2">Project Description:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        {inquiry.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Existing System:</strong> {inquiry.hasExistingSystem ? 'Yes' : 'No'}
                    </div>
                    {inquiry.filePath && (
                      <div>
                        <strong>File Uploaded:</strong> {inquiry.filePath}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {/* View Details Button */}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/inquiries/${inquiry.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    
                    {/* Download/Preview File Button */}
                    {inquiry.filePath && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/api/files/${encodeURIComponent(inquiry.filePath)}`}>
                          <Download className="h-4 w-4 mr-1" />
                          Download File
                        </Link>
                      </Button>
                    )}
                    
                    {/* Interactive Action Buttons */}
                    <InquiryActions inquiry={inquiry} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 