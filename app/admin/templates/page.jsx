import { getAllTemplates } from '@/lib/templates.js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package } from 'lucide-react';
import { noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminTemplatesPage() {
  noStore();
  
  // Fetch templates directly on the server
  const templates = await getAllTemplates();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
          
          <Button disabled title="Add template functionality requires the full client component - coming soon">
            <Package className="w-4 h-4 mr-2" />
            Add Template
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
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-zinc-400">{template.shortDesc}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">${template.price}</Badge>
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
        </CardContent>
      </Card>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No templates found.</p>
            <Button disabled title="Add template functionality requires the full client component - coming soon">
              <Package className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 