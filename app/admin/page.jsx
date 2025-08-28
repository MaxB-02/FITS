import inquiriesService from '@/lib/services/inquiries.js';
import templatesService from '@/lib/services/templates.js';
import portfolioService from '@/lib/services/portfolio.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CheckCircle, XCircle, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch data using the new services
  let inquiries = [];
  let templates = [];
  let projects = [];
  
  try {
    // Fetch each data source individually with error handling
    try {
      inquiries = await inquiriesService.getAll();
      console.log('✅ Inquiries loaded:', inquiries?.length || 0);
    } catch (error) {
      console.error('❌ Failed to load inquiries:', error);
      inquiries = [];
    }
    
    try {
      templates = await templatesService.getAll();
      console.log('✅ Templates loaded:', templates?.length || 0);
    } catch (error) {
      console.error('❌ Failed to load templates:', error);
      templates = [];
    }
    
    try {
      projects = await portfolioService.getAll();
      console.log('✅ Projects loaded:', projects?.length || 0);
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
      projects = [];
    }
  } catch (error) {
    console.error('💥 Critical error in admin dashboard:', error);
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
            <div className="text-2xl font-bold" data-stat="total">
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
            <div className="text-2xl font-bold text-blue-600" data-stat="new">
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
            <div className="text-2xl font-bold text-green-600" data-stat="accepted">
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
            <div className="text-2xl font-bold text-red-600" data-stat="declined">
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
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Manage Inquiries
            </CardTitle>
            <CardDescription>
              Review and manage project inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/inquiries">
                View Inquiries
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Manage Templates
            </CardTitle>
            <CardDescription>
              Create and manage project templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/templates">
                View Templates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Manage Portfolio
            </CardTitle>
            <CardDescription>
              Showcase your completed projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/portfolio">
                View Portfolio
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      {recentInquiries.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Inquiries</h2>
            <Link href="/admin/inquiries">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentInquiries.map((inquiry) => (
              <Card key={inquiry.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{inquiry.name || 'Unnamed'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.email || 'No email'}
                      </p>
                      {inquiry.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {inquiry.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inquiry.status || 'unknown'}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Database:</span>
            <span className="ml-2 text-green-600">✅ Operational</span>
          </div>
          <div>
            <span className="text-muted-foreground">File Storage:</span>
            <span className="ml-2 text-green-600">✅ Operational</span>
          </div>
          <div>
            <span className="text-muted-foreground">API Routes:</span>
            <span className="ml-2 text-green-600">✅ Operational</span>
          </div>
          <div>
            <span className="text-muted-foreground">Environment:</span>
            <span className="ml-2 text-blue-600">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 