import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CheckCircle, XCircle, ArrowRight, Package } from 'lucide-react';
import { getAllInquiries } from '@/lib/inquiries.js';
import { getAllTemplates } from '@/lib/templates.js';
import { getAllProjects } from '@/lib/portfolio.js';

export default async function AdminDashboardPage() {
  const [inquiries, templates, projects] = await Promise.all([
    getAllInquiries(),
    getAllTemplates(),
    getAllProjects()
  ]);

  // Calculate stats
  const stats = {
    total: inquiries.length,
    new: inquiries.filter(inq => inq.status === 'new').length,
    accepted: inquiries.filter(inq => inq.status === 'accepted').length,
    declined: inquiries.filter(inq => inq.status === 'declined').length
  };

  // Get recent inquiries (last 5)
  const recentInquiries = inquiries.slice(0, 5);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: 'default',
      accepted: 'secondary',
      declined: 'destructive'
    };

    return variants[status] || 'default';
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Developer Portal Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your project inquiry and template management dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              All time inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.new}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.accepted}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.declined}
            </div>
            <p className="text-xs text-muted-foreground">
              Rejected inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Inquiries</CardTitle>
            <CardDescription>
              Review and manage project inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/inquiries">
                View All Inquiries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Templates</CardTitle>
            <CardDescription>
              Create and edit templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/templates">
                Manage Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Portfolio</CardTitle>
            <CardDescription>
              Showcase completed projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/portfolio">
                Manage Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Template Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Template Count</CardTitle>
            <CardDescription>
              Total available templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {templates.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Projects</CardTitle>
            <CardDescription>
              Showcase completed work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {projects.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Portfolio projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>
              Latest inquiry submissions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No inquiries yet</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{inquiry.name}</p>
                      <p className="text-muted-foreground text-xs">{inquiry.email}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inquiry.status}
                      </div>
                      <p className="text-muted-foreground text-xs mt-1">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Templates</CardTitle>
            <CardDescription>
              Latest template updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No templates yet</p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 5).map((template) => (
                  <div key={template.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{template.name}</p>
                      <p className="text-muted-foreground text-xs">${template.price}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-muted-foreground text-xs">
                        {formatDate(template.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 