'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    shortDesc: '',
    longDesc: '',
    cover: '',
    previewUrl: '',
    buyUrl: '',
    features: [],
    useCases: [],
    active: true
  });

  const [newFeature, setNewFeature] = useState('');
  const [newUseCase, setNewUseCase] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Template name is required');
      return;
    }
    if (!formData.shortDesc.trim()) {
      alert('Short description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Price must be a positive number');
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log('Submitting template data:', formData);
      
      // Generate a unique ID for the template
      const templateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: templateId,
          price: parseFloat(formData.price) || 0
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Template created successfully:', result);
        router.push('/admin/templates');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${error.message || error.error || 'Unknown error'}`);
        } catch (parseError) {
          alert(`Error ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Network or other error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addUseCase = () => {
    if (newUseCase.trim()) {
      setFormData(prev => ({
        ...prev,
        useCases: [...prev.useCases, newUseCase.trim()]
      }));
      setNewUseCase('');
    }
  };

  const removeUseCase = (index) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/templates" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Link>
        <h1 className="text-3xl font-bold">Add New Template</h1>
        <p className="text-muted-foreground mt-2">Create a new template for your customers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description *</Label>
                <Input
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  placeholder="Brief description of the template"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDesc">Long Description</Label>
                <Textarea
                  id="longDesc"
                  value={formData.longDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, longDesc: e.target.value }))}
                  placeholder="Detailed description of the template"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewUrl">Preview URL</Label>
                <Input
                  id="previewUrl"
                  value={formData.previewUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, previewUrl: e.target.value }))}
                  placeholder="https://example.com/preview (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyUrl">Buy URL</Label>
                <Input
                  id="buyUrl"
                  value={formData.buyUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, buyUrl: e.target.value }))}
                  placeholder="https://example.com/buy (optional)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Key features of your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>What problems does this template solve?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newUseCase}
                  onChange={(e) => setNewUseCase(e.target.value)}
                  placeholder="Add a use case"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUseCase())}
                />
                <Button type="button" onClick={addUseCase} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.useCases.map((useCase, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {useCase}
                    <button
                      type="button"
                      onClick={() => removeUseCase(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Template visibility and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Active (visible to customers)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/templates">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
