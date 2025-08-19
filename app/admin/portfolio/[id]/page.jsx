'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function EditPortfolioPage({ params }) {
  const { toast } = useToast();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    shortDesc: '',
    longDesc: '',
    cover: '',
    images: '',
    sheetUrl: '',
    buyUrl: '',
    previewUrl: '',
    useCases: '',
    active: true
  });

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/portfolio/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setFormData({
          id: data.id,
          title: data.title,
          shortDesc: data.shortDesc,
          longDesc: data.longDesc || '',
          cover: data.cover || '',
          images: Array.isArray(data.images) ? data.images.join(', ') : '',
          sheetUrl: data.sheetUrl || '',
          buyUrl: data.buyUrl || '',
          previewUrl: data.previewUrl || '',
          useCases: Array.isArray(data.useCases) ? data.useCases.join(', ') : '',
          active: data.active !== undefined ? data.active : true
        });
      } else {
        throw new Error('Failed to fetch project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setSaving(true);
    
    try {
      // Transform comma-separated strings back to arrays
      const transformedData = {
        ...formData,
        images: formData.images ? formData.images.split(',').map(item => item.trim()).filter(item => item) : [],
        useCases: formData.useCases ? formData.useCases.split(',').map(item => item.trim()).filter(item => item) : [],
        updatedAt: new Date().toISOString()
      };
      
      console.log('Sending request with transformed data:', transformedData);
      
      const response = await fetch(`/api/admin/portfolio/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        router.push('/admin/portfolio');
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Exception during form submission:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio/${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        router.push('/admin/portfolio');
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested project could not be found.</p>
          <Link href="/admin/portfolio">
            <Button variant="outline">Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/portfolio">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update project information for {project.title}
            </p>
          </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update the project information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" onInvalid={(e) => console.log('Form validation failed:', e)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID (Slug)</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="project-id"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Project title"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shortDesc">Short Description</Label>
              <Textarea
                id="shortDesc"
                value={formData.shortDesc}
                onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                placeholder="Brief description of the project"
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="longDesc">Long Description</Label>
              <Textarea
                id="longDesc"
                value={formData.longDesc}
                onChange={(e) => handleInputChange('longDesc', e.target.value)}
                placeholder="Detailed description of the project"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) => handleInputChange('cover', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="sheetUrl">Google Sheet URL (Optional)</Label>
                <Input
                  id="sheetUrl"
                  value={formData.sheetUrl}
                  onChange={(e) => handleInputChange('sheetUrl', e.target.value)}
                                      placeholder="https://example.com/sheet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyUrl">Buy URL (Optional)</Label>
                <Input
                  id="buyUrl"
                  value={formData.buyUrl}
                  onChange={(e) => handleInputChange('buyUrl', e.target.value)}
                  placeholder="https://gumroad.com/l/project-id or leave empty to route to /inquire"
                />
              </div>
              <div>
                <Label htmlFor="previewUrl">Preview URL (Optional)</Label>
                <Input
                  id="previewUrl"
                  value={formData.previewUrl}
                  onChange={(e) => handleInputChange('previewUrl', e.target.value)}
                                      placeholder="https://example.com/preview"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) => handleInputChange('images', e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
              <Textarea
                id="useCases"
                value={formData.useCases}
                onChange={(e) => handleInputChange('useCases', e.target.value)}
                placeholder="Use case 1, Use case 2, Use case 3"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', checked)}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </Button>
              
              <div className="flex space-x-2">
                <Link href="/admin/portfolio">
                  <Button type="button" variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving} onClick={() => console.log('Save button clicked')}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    console.log('Test button clicked, current formData:', formData);
                    handleSubmit({ preventDefault: () => {} });
                  }}
                  disabled={saving}
                >
                  Test Save
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 