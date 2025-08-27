'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function InteractiveInquiryCard({ inquiry, formatDate, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      setUpdating(true);
      
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Call the parent callback
          onUpdate(result.inquiry);
          
          toast({
            title: "Success",
            description: `Inquiry ${newStatus} successfully.`,
          });
          
          // Force a page refresh to show updated data
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${newStatus} inquiry`);
      }
    } catch (error) {
      console.error(`Error updating inquiry status:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${newStatus} inquiry. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(true);
      
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Call the parent callback
          onDelete(inquiryId);
          
          toast({
            title: "Success",
            description: "Inquiry deleted successfully.",
          });
          
          // Force a page refresh to show updated data
          window.location.reload();
        }
      } else {
        throw new Error('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
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

            {/* Status Update Buttons */}
            {inquiry.status === 'new' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleStatusUpdate(inquiry.id, 'accepted')}
                  disabled={updating}
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  )}
                  {updating ? 'Updating...' : 'Accept'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleStatusUpdate(inquiry.id, 'declined')}
                  disabled={updating}
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {updating ? 'Updating...' : 'Decline'}
                </Button>
              </div>
            )}

            {/* Delete Button */}
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDelete(inquiry.id)}
              disabled={updating}
            >
              {updating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              {updating ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
