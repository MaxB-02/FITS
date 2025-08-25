export const dynamic = 'force-dynamic';

import { getAllTemplates } from '@/lib/templates.js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package } from 'lucide-react';

export default async function AdminTemplatesPage() {
  // Fetch templates directly on the server with bulletproof error handling
  let templates = [];
  try {
    templates = await getAllTemplates();
    console.log('Templates loaded:', templates?.length || 0);
  } catch (error) {
    console.error('Failed to load templates:', error);
    templates = [];
  }
  
  // Ensure we have an array and filter out invalid data
  if (!Array.isArray(templates)) {
    templates = [];
  }
  
  // Filter out any malformed template objects
  templates = templates.filter(template => template && template.id);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-zinc-400 mt-2">Manage your templates</p>
        </div>
        
        <div className="flex space-x-2">
          <Link href="/admin/portfolio">
            <Button variant="outline">Portfolio</Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button variant="outline">Inquiries</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline">Dashboard</Button>
          </Link>
          
          <Button asChild>
            <Link href="/admin/templates/new">
              <Package className="w-4 h-4 mr-2" />
              Add Template
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>All Templates ({templates.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No templates found.</p>
              <p className="text-sm text-gray-500 mt-2">
                Templates will appear here when you create them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Updated</th>
                    <th className="text-left py-3 px-4 font-medium">Active</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{template.name || 'Unnamed Template'}</div>
                          <div className="text-sm text-zinc-400">{template.shortDesc || 'No description'}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">${template.price || 0}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-400">
                        {template.updatedAt ? formatDate(template.updatedAt) : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/templates/${template.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            title="Delete functionality requires the full client component - coming soon"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 