'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Zod schema for form validation
const CreateProjectSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required'),
  shortDesc: z.string().min(1, 'Short description is required'),
  longDesc: z.string().min(1, 'Long description is required'),
  cover: z.string().optional(),
  images: z.string().optional(),
  sheetUrl: z.string().optional(),
  buyUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  useCases: z.string().optional(),
  active: z.boolean().default(true)
});

export default function AdminPortfolioPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(CreateProjectSchema),
    mode: 'onChange'
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProject(null);
    setShowForm(true);
    setServerError(null);
    reset({
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
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
    setServerError(null);
    setValue('id', project.id);
    setValue('title', project.title);
    setValue('shortDesc', project.shortDesc);
    setValue('longDesc', project.longDesc);
    setValue('cover', project.cover || '');
    setValue('images', Array.isArray(project.images) ? project.images.join(', ') : '');
    setValue('sheetUrl', project.sheetUrl || '');
    setValue('buyUrl', project.buyUrl || '');
    setValue('previewUrl', project.previewUrl || '');
    setValue('useCases', Array.isArray(project.useCases) ? project.useCases.join(', ') : '');
    setValue('active', project.active !== undefined ? project.active : true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setServerError(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const transformedData = {
        ...data,
        images: data.images ? data.images.split(',').map(item => item.trim()).filter(item => item) : [],
        useCases: data.useCases ? data.useCases.split(',').map(item => item.trim()).filter(item => item) : [],
        updatedAt: new Date().toISOString()
      };

      const url = editingProject 
        ? `/api/admin/portfolio/${editingProject.id}`
        : '/api/admin/portfolio';
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: editingProject ? "Project updated successfully" : "Project created successfully"
        });
        setShowForm(false);
        setEditingProject(null);
        reset();
        fetchProjects();
      } else {
        const error = await response.json();
        setServerError({
          message: error.message || 'Failed to save project',
          issues: error.issues || []
        });
        
        // Focus on first invalid field if validation issues
        if (error.issues && error.issues.length > 0) {
          const firstIssue = error.issues[0];
          const fieldName = firstIssue.path?.[0];
          if (fieldName) {
            const element = document.getElementById(fieldName);
            if (element) {
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      }
    } catch (error) {
      setServerError({
        message: 'Network error occurred',
        issues: []
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (project) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          active: !project.active,
          updatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        fetchProjects();
        toast({
          title: "Success",
          description: `Project ${!project.active ? 'activated' : 'deactivated'} successfully`
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || 'Failed to update project status',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to update project status',
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio/${project.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProjects();
        toast({
          title: "Success",
          description: "Project deleted successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || 'Failed to delete project',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to delete project',
        variant: "destructive"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Button onClick={handleCreateNew} disabled={showForm}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</CardTitle>
            <CardDescription>
              {editingProject ? 'Update project information' : 'Add a new portfolio project'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Server Error Alert */}
            {serverError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {serverError.message}
                  {serverError.issues && serverError.issues.length > 0 && (
                    <ul className="mt-2 list-disc list-inside">
                      {serverError.issues.map((issue, index) => (
                        <li key={index}>
                          {issue.path?.join('.')}: {issue.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id">ID (Slug) *</Label>
                  <Input
                    id="id"
                    {...register('id')}
                    placeholder="project-id"
                    disabled={!!editingProject}
                    className={errors.id ? 'border-destructive' : ''}
                  />
                  {errors.id && (
                    <p className="text-sm text-destructive mt-1">{errors.id.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Project title"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Textarea
                  id="shortDesc"
                  {...register('shortDesc')}
                  placeholder="Brief description of the project"
                  rows={2}
                  className={errors.shortDesc ? 'border-destructive' : ''}
                />
                {errors.shortDesc && (
                  <p className="text-sm text-destructive mt-1">{errors.shortDesc.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="longDesc">Long Description *</Label>
                <Textarea
                  id="longDesc"
                  {...register('longDesc')}
                  placeholder="Detailed description of the project"
                  rows={4}
                  className={errors.longDesc ? 'border-destructive' : ''}
                />
                {errors.longDesc && (
                  <p className="text-sm text-destructive mt-1">{errors.longDesc.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cover">Cover Image URL</Label>
                  <Input
                    id="cover"
                    {...register('cover')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="sheetUrl">Google Sheet URL</Label>
                  <Input
                    id="sheetUrl"
                    {...register('sheetUrl')}
                    placeholder="https://example.com/sheet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyUrl">Buy URL</Label>
                  <Input
                    id="buyUrl"
                    {...register('buyUrl')}
                    placeholder="https://gumroad.com/l/project-id or leave empty to route to /inquire"
                  />
                </div>
                <div>
                  <Label htmlFor="previewUrl">Preview URL</Label>
                  <Input
                    id="previewUrl"
                    {...register('previewUrl')}
                    placeholder="https://example.com/preview"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Textarea
                  id="images"
                  {...register('images')}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
                <Textarea
                  id="useCases"
                  {...register('useCases')}
                  placeholder="Project management, Data analysis, Reporting"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  {...register('active')}
                  checked={watchedValues.active}
                  onCheckedChange={(checked) => setValue('active', checked)}
                />
                <Label htmlFor="active">Active (visible on public portfolio)</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={submitting || !isValid}>
                  {submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {project.cover && (
                    <img
                      src={project.cover}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <Badge variant={project.active ? "default" : "secondary"}>
                        {project.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{project.shortDesc}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>ID: {project.id}</span>
                      {project.updatedAt && (
                        <span>• Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={project.active}
                    onCheckedChange={() => handleToggleActive(project)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/portfolio/${project.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(project)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No portfolio projects yet.</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 