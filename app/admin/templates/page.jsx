'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const { toast } = useToast();

  // Form state for new template
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    shortDesc: '',
    longDesc: '',
    features: '',
    useCases: '',
    images: '',
    cover: '',
    previewUrl: '',
    purchaseUrl: '',
    active: false
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      console.log('Fetching templates...');
      const response = await fetch('/api/admin/templates');
      console.log('Templates API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Templates API response data:', data);
        setTemplates(data);
        console.log('Templates state updated with', data.length, 'templates');
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      shortDesc: '',
      longDesc: '',
      features: '',
      useCases: '',
      images: '',
      cover: '',
      previewUrl: '',
      purchaseUrl: '',
      active: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form data:', formData);
      
      // Validate required fields
      if (!formData.id || !formData.name || !formData.price || !formData.shortDesc) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields: ID, Name, Price, and Short Description",
          variant: "destructive"
        });
        return;
      }

      // Normalize ID to kebab-case
      const normalizedId = formData.id.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      
      // Convert form data to the expected template structure (same as edit template)
      const templateData = {
        ...formData,
        id: normalizedId,
        price: parseFloat(formData.price) || 0,
        features: formData.features ? formData.features.split(',').map(item => item.trim()).filter(item => item) : [],
        useCases: formData.useCases ? formData.useCases.split(',').map(item => item.trim()).filter(item => item) : [],
        images: formData.images ? formData.images.split(',').map(item => item.trim()).filter(item => item) : [],
        // Use placeholder image if cover is empty
        cover: formData.cover || 'https://picsum.photos/seed/template/600'
      };

      console.log('Sending template data to API:', templateData);

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response data:', result);

      if (response.ok && result.ok) {
        toast({
          title: "Success",
          description: `Template "${result.template.name}" created successfully.`
        });
        setAddDialogOpen(false);
        resetForm();
        await fetchTemplates(); // Wait for the fetch to complete
        console.log('Templates refreshed, new count:', templates.length);
      } else {
        // Handle specific error cases
        let errorMessage = 'Failed to create template';
        
        if (response.status === 409) {
          errorMessage = 'Template with this ID already exists. Please choose a different ID.';
        } else if (response.status === 400) {
          errorMessage = result.error || 'Validation failed. Please check your input.';
        } else if (result.error) {
          errorMessage = result.error;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    }
  };

  const handleActiveToggle = async (templateId, currentActive) => {
    const newActive = !currentActive;
    
    // Optimistic update
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, active: newActive } : t)
    );

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          active: newActive,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      toast({
        title: "Success",
        description: "Status updated."
      });
    } catch (error) {
      console.error('Error updating template:', error);
      // Revert optimistic update
      setTemplates(prev => 
        prev.map(t => t.id === templateId ? { ...t, active: currentActive } : t)
      );
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (templateId) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template deleted."
        });
        setDeletingTemplate(null);
        fetchTemplates();
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-400">Loading templates...</div>
      </div>
    );
  }

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
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">ID (Slug) *</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      placeholder="inventory-tracker"
                      required
                    />
                    <p className="text-xs text-zinc-400 mt-1">Used in URLs, will be converted to kebab-case</p>
                  </div>
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cover">Cover Image URL (optional)</Label>
                    <Input
                      id="cover"
                      value={formData.cover}
                      onChange={(e) => handleInputChange('cover', e.target.value)}
                      placeholder="https://picsum.photos/seed/template/600"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="shortDesc">Short Description *</Label>
                  <Input
                    id="shortDesc"
                    value={formData.shortDesc}
                    onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="longDesc">Long Description</Label>
                  <Textarea
                    id="longDesc"
                    value={formData.longDesc}
                    onChange={(e) => handleInputChange('longDesc', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => handleInputChange('features', e.target.value)}
                      rows={3}
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
                    <Textarea
                      id="useCases"
                      value={formData.useCases}
                      onChange={(e) => handleInputChange('useCases', e.target.value)}
                      rows={3}
                      placeholder="Use case 1, Use case 2, Use case 3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previewUrl">Preview URL</Label>
                    <Input
                      id="previewUrl"
                      value={formData.previewUrl}
                      onChange={(e) => handleInputChange('previewUrl', e.target.value)}
                      placeholder="https://example.com/preview"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseUrl">Purchase URL</Label>
                    <Input
                      id="purchaseUrl"
                      value={formData.purchaseUrl}
                      onChange={(e) => handleInputChange('purchaseUrl', e.target.value)}
                      placeholder="/checkout/template-id"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="images">Image URLs (comma-separated)</Label>
                  <Textarea
                    id="images"
                    value={formData.images}
                    onChange={(e) => handleInputChange('images', e.target.value)}
                    rows={2}
                    placeholder="/templates/image1.png, /templates/image2.png"
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
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Template</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                      {formatDate(template.updatedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Switch
                        checked={template.active}
                        onCheckedChange={() => handleActiveToggle(template.id, template.active)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/templates/${template.id}`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingTemplate(template)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTemplate} onOpenChange={() => setDeletingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{deletingTemplate?.name}"? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeletingTemplate(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deletingTemplate?.id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 