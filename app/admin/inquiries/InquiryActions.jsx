'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function InquiryActions({ inquiry }) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateDashboardNumbers = async () => {
    try {
      // Fetch the latest inquiry stats
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const inquiries = await response.json();
        
        // Calculate new stats
        const stats = {
          total: inquiries.length,
          new: inquiries.filter(inq => inq.status === 'new').length,
          accepted: inquiries.filter(inq => inq.status === 'accepted').length,
          declined: inquiries.filter(inq => inq.status === 'declined').length
        };
        
        // Update dashboard numbers if they exist on the page
        const totalElement = document.querySelector('[data-stat="total"]');
        const newElement = document.querySelector('[data-stat="new"]');
        const acceptedElement = document.querySelector('[data-stat="accepted"]');
        const declinedElement = document.querySelector('[data-stat="declined"]');
        
        if (totalElement) totalElement.textContent = stats.total;
        if (newElement) newElement.textContent = stats.new;
        if (acceptedElement) acceptedElement.textContent = stats.accepted;
        if (declinedElement) declinedElement.textContent = stats.declined;
      }
    } catch (error) {
      console.error('Failed to update dashboard numbers:', error);
    }
  };

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
          
          // Update the inquiry status in the current page
          const statusBadge = document.querySelector(`[data-inquiry-id="${inquiryId}"] .status-badge`);
          if (statusBadge) {
            statusBadge.textContent = newStatus;
            // Update badge variant
            statusBadge.className = `status-badge ${newStatus === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
          }
          
          // Update dashboard numbers
          setTimeout(() => {
            updateDashboardNumbers();
          }, 500);
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
          
          // Remove the inquiry card from the current page
          const inquiryCard = document.querySelector(`[data-inquiry-id="${inquiryId}"]`);
          if (inquiryCard) {
            inquiryCard.remove();
          }
          
          // Update dashboard numbers
          setTimeout(() => {
            updateDashboardNumbers();
          }, 500);
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
