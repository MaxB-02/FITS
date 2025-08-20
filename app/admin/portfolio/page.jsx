import { getAllProjects } from '@/lib/portfolio.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  noStore();
  
  // Fetch projects directly on the server with bulletproof error handling
  let projects = [];
  try {
    projects = await getAllProjects();
    console.log('Projects loaded:', projects?.length || 0);
  } catch (error) {
    console.error('Failed to load projects:', error);
    projects = [];
  }
  
  // Ensure we have an array and filter out invalid data
  if (!Array.isArray(projects)) {
    projects = [];
  }
  
  // Filter out any malformed project objects
  projects = projects.filter(project => project && project.id);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No portfolio projects yet.</p>
            <Button asChild>
              <Link href="/admin/portfolio/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {project.cover && (
                      <img
                        src={project.cover}
                        alt={project.title || 'Project'}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">{project.title || 'Unnamed Project'}</h3>
                        <Badge variant={project.active ? "default" : "secondary"}>
                          {project.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{project.shortDesc || 'No description'}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>ID: {project.id}</span>
                        {project.updatedAt && (
                          <span>• Updated: {formatDate(project.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/portfolio/${project.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/portfolio/${project.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled
                      title="Delete functionality requires the full client component - coming soon"
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