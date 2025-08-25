import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CheckCircle, XCircle, ArrowRight, Package } from 'lucide-react';
import { getAllInquiries } from '@/lib/inquiries.js';
import { getAllTemplates } from '@/lib/templates.js';
import { getAllProjects } from '@/lib/portfolio.js';
import { initializeProductionData } from '@/lib/init-production-data.js';
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Initialize production data if needed
  try {
    await initializeProductionData();
  } catch (error) {
    console.log('Production data initialization skipped or failed:', error.message);
  }

  // Initialize with empty arrays as fallbacks
  let inquiries = [];
  let templates = [];
  let projects = [];
  
  // Try to fetch data, but never let it crash the page
  try {
    // Fetch each data source individually with error handling
    try {
      inquiries = await getAllInquiries();
      console.log('Inquiries loaded:', inquiries?.length || 0);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      inquiries = [];
    }
    
    try {
      templates = await getAllTemplates();
      console.log('Templates loaded:', templates?.length || 0);
    } catch (error) {
      console.error('Failed to load templates:', error);
      templates = [];
    }
    
    try {
      projects = await getAllProjects();
      console.log('Projects loaded:', projects?.length || 0);
    } catch (error) {
      console.error('Failed to load projects:', error);
      projects = [];
    }
  } catch (error) {
    console.error('Critical error in admin dashboard:', error);
    // Continue with empty arrays
  }
  
  // Ensure we have arrays and safe defaults
  if (!Array.isArray(inquiries)) inquiries = [];
  if (!Array.isArray(templates)) templates = [];
  if (!Array.isArray(projects)) projects = [];

  // Calculate stats with maximum safety
  const stats = {
    total: inquiries.length || 0,
    new: inquiries.filter(inq => inq && inq.status === 'new').length || 0,
    accepted: inquiries.filter(inq => inq && inq.status === 'accepted').length || 0,
    declined: inquiries.filter(inq => inq && inq.status === 'declined').length || 0
  };

  // Calculate template stats
  const templateStats = {
    total: templates.length || 0,
    active: templates.filter(t => t && t.active !== false).length || 0
  };

  // Get recent inquiries (last 5) with safety checks
  const recentInquiries = inquiries.slice(0, 5).filter(inq => inq && inq.id);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    try {
      const variants = {
        new: 'default',
        accepted: 'secondary',
        declined: 'destructive'
      };
      return variants[status] || 'default';
    } catch (error) {
      return 'default';
    }
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
            <CardTitle>Total Templates</CardTitle>
            <CardDescription>
              All templates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {templateStats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Templates</CardTitle>
            <CardDescription>
              Templates currently active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {templateStats.active}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Projects</CardTitle>
            <CardDescription>
              Showcase completed work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {projects.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
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
                {recentInquiries.map((inquiry) => {
                  if (!inquiry || !inquiry.id) return null;
                  
                  return (
                    <div key={inquiry.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{inquiry.name || 'Unnamed'}</p>
                        <p className="text-muted-foreground text-xs">{inquiry.email || 'No email'}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inquiry.status || 'unknown'}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                {templates.slice(0, 5).map((template) => {
                  if (!template || !template.id) return null;
                  
                  return (
                    <div key={template.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{template.name || 'Unnamed Template'}</p>
                        <p className="text-muted-foreground text-xs">${template.price || 0}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-muted-foreground text-xs">
                          {formatDate(template.updatedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 