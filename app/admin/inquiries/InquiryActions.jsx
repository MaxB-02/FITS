'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function InquiryActions({ inquiry }) {
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
    <>
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
    </>
  );
}
