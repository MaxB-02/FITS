'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, CheckCircle, XCircle, Trash2, Search, Download } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        throw new Error('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    const action = newStatus === 'accepted' ? 'accept' : 'decline';
    if (!confirm(`Are you sure you want to ${action} this inquiry?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Inquiry ${action}ed successfully`,
        });
        fetchInquiries(); // Refresh the list
      } else {
        throw new Error('Failed to update inquiry');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Inquiry deleted successfully",
        });
        fetchInquiries(); // Refresh the list
      } else {
        throw new Error('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive"
      });
    }
  };

  const handleFileDownload = (filePath) => {
    if (!filePath) return;
    
    // Create a link to download the file using the API route
    const link = document.createElement('a');
    link.href = `/api/files/${filePath.replace('uploads/', '')}`;
    link.download = filePath.split('/').pop(); // Extract filename
    link.target = '_blank'; // Open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading inquiries...</div>
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
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    {inquiry.company && <p className="text-sm text-gray-600">{inquiry.company}</p>}
                  </div>
                  <div className="text-right">
                    <Badge variant={inquiry.status === 'new' ? 'default' : inquiry.status === 'accepted' ? 'secondary' : 'destructive'}>
                      {inquiry.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inquiry.services && inquiry.services.length > 0 && (
                    <div>
                      <strong>Services:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {inquiry.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <strong>Description:</strong>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {inquiry.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {inquiry.phone && (
                      <div>
                        <strong>Phone:</strong> {inquiry.phone}
                      </div>
                    )}
                    {inquiry.budgetLow || inquiry.budgetHigh ? (
                      <div>
                        <strong>Budget:</strong> 
                        {inquiry.budgetLow && inquiry.budgetHigh 
                          ? `$${inquiry.budgetLow} - $${inquiry.budgetHigh}`
                          : inquiry.budgetLow 
                            ? `$${inquiry.budgetLow}+`
                            : `Up to $${inquiry.budgetHigh}`
                        }
                      </div>
                    ) : inquiry.budget && (
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
                          onClick={() => handleFileDownload(inquiry.filePath)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download File
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const fileUrl = `/api/files/${inquiry.filePath.replace('uploads/', '')}`;
                            window.open(fileUrl, '_blank');
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview File
                        </Button>
                      </>
                    )}

                    {inquiry.status === 'new' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(inquiry.id, 'accepted')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(inquiry.id, 'declined')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(inquiry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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