'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const { toast } = useToast();

  // Fetch inquiries on component mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        throw new Error('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [inquiryId]: true }));
      
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
          setInquiries(prev => 
            prev.map(inq => 
              inq.id === inquiryId ? result.inquiry : inq
            )
          );
          
          toast({
            title: "Success",
            description: `Inquiry ${newStatus} successfully.`,
          });
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
      setUpdating(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(prev => ({ ...prev, [inquiryId]: true }));
      
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setInquiries(prev => prev.filter(inq => inq.id !== inquiryId));
          
          toast({
            title: "Success",
            description: "Inquiry deleted successfully.",
          });
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
      setUpdating(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

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

                    {/* Status Update Buttons */}
                    {inquiry.status === 'new' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleStatusUpdate(inquiry.id, 'accepted')}
                          disabled={updating[inquiry.id]}
                        >
                          {updating[inquiry.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          {updating[inquiry.id] ? 'Updating...' : 'Accept'}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusUpdate(inquiry.id, 'declined')}
                          disabled={updating[inquiry.id]}
                        >
                          {updating[inquiry.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {updating[inquiry.id] ? 'Updating...' : 'Decline'}
                        </Button>
                      </div>
                    )}

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(inquiry.id)}
                      disabled={updating[inquiry.id]}
                    >
                      {updating[inquiry.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      {updating[inquiry.id] ? 'Deleting...' : 'Delete'}
                    </Button>
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