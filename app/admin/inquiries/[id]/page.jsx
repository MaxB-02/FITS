import { getInquiryById } from '@/lib/inquiries.js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Trash2, Calendar, DollarSign, Globe, Building, FileText } from 'lucide-react';

export default async function InquiryDetailPage({ params }) {
  const inquiry = await getInquiryById(params.id);
  
  if (!inquiry) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: 'default',
      checked: 'secondary',
      dropped: 'destructive'
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inquiries
            </Link>
            <h1 className="text-3xl font-bold mb-2">{inquiry.name}</h1>
            <p className="text-muted-foreground">{inquiry.email}</p>
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
        <div className="text-right">
          {getStatusBadge(inquiry.status)}
          <p className="text-sm text-muted-foreground mt-1">
            Submitted {formatDate(inquiry.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {inquiry.description}
              </p>
            </CardContent>
          </Card>

          {/* Services */}
          {inquiry.services && inquiry.services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services Requested</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {inquiry.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inquiry.templateId && (
                <div>
                  <strong>Template ID:</strong>
                  <Link 
                    href={`/templates/${inquiry.templateId}`}
                    className="text-emerald-500 hover:underline ml-2"
                  >
                    {inquiry.templateId}
                  </Link>
                </div>
              )}
              
              {inquiry.hasExistingFile && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>Has existing file or system</span>
                </div>
              )}
              
              {inquiry.fileUrl && (
                <div>
                  <strong>File URL:</strong>
                  <a 
                    href={inquiry.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:underline ml-2"
                  >
                    {inquiry.fileUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  <strong>Email:</strong> {inquiry.email || '—'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  <strong>Phone:</strong> {inquiry.phone || '—'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Company:</strong> {inquiry.company || '—'}
                </span>
              </div>
              
              {inquiry.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Website:</strong>
                    <a 
                      href={inquiry.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline ml-1"
                    >
                      {inquiry.website}
                    </a>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inquiry.budget && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Budget:</strong> {inquiry.budget}
                  </span>
                </div>
              )}
              
              {inquiry.desiredDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Desired Date:</strong> {inquiry.desiredDate}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inquiry.status === 'new' && (
                <>
                  <Button 
                    className="w-full text-green-600 hover:text-green-700"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/api/admin/inquiries/${inquiry.id}?action=check`}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Checked
                    </Link>
                  </Button>
                  
                  <Button 
                    className="w-full text-red-600 hover:text-red-700"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/api/admin/inquiries/${inquiry.id}?action=drop`}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark as Dropped
                    </Link>
                  </Button>
                </>
              )}
              
              <Button 
                className="w-full text-red-600 hover:text-red-700"
                variant="outline"
                asChild
              >
                <Link href={`/api/admin/inquiries/${inquiry.id}?action=delete`}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Inquiry
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 