'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Trash2, Download } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('/api/admin/inquiries');
        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

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
        {loading ? 'Loading...' : `Showing ${inquiries.length} inquiries`}
      </div>

      {/* Inquiries List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Loading inquiries...</p>
          </CardContent>
        </Card>
      ) : inquiries.length === 0 ? (
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
                          className="text-green-600 hover:text-green-700"
                        >
                          <Link href={`/api/files/${inquiry.filePath.replace('uploads/', '')}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview File
                          </Link>
                        </Button>
                      </>
                    )}

                    {inquiry.status === 'new' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'accepted' })
                              });
                              if (response.ok) window.location.reload();
                            } catch (error) {
                              console.error('Error updating inquiry:', error);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'declined' })
                              });
                              if (response.ok) window.location.reload();
                            } catch (error) {
                              console.error('Error updating inquiry:', error);
                            }
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this inquiry?')) {
                          try {
                            const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
                              method: 'DELETE'
                            });
                            if (response.ok) window.location.reload();
                          } catch (error) {
                            console.error('Error deleting inquiry:', error);
                          }
                        }
                      }}
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