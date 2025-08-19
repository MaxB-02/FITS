'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';

export default function TemplateDetail({ template, onSave, onDelete, isEditing = false }) {
  const { toast } = useToast();
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
    buyUrl: '',
    active: true
  });

  useEffect(() => {
    if (template) {
      setFormData({
        id: template.id || '',
        name: template.name || '',
        price: template.price || '',
        shortDesc: template.shortDesc || '',
        longDesc: template.longDesc || '',
        features: Array.isArray(template.features) ? template.features.join(', ') : '',
        useCases: Array.isArray(template.useCases) ? template.useCases.join(', ') : '',
        images: Array.isArray(template.images) ? template.images.join(', ') : '',
        cover: template.cover || '',
        previewUrl: template.previewUrl || '',
        purchaseUrl: template.purchaseUrl || '',
        buyUrl: template.buyUrl || '',
        active: template.active !== undefined ? template.active : true
      });
    }
  }, [template]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSave = async () => {
    try {
      // Convert form data back to the expected template structure
      const templateData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        features: formData.features ? formData.features.split(',').map(item => item.trim()).filter(item => item) : [],
        useCases: formData.useCases ? formData.useCases.split(',').map(item => item.trim()).filter(item => item) : [],
        images: formData.images ? formData.images.split(',').map(item => item.trim()).filter(item => item) : [],
        // Use placeholder image if cover is empty
        cover: formData.cover || 'https://picsum.photos/seed/template/600'
      };

      await onSave(templateData);
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await onDelete();
        toast({
          title: "Success",
          description: "Template deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete template",
          variant: "destructive",
        });
      }
    }
  };

  if (!template) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Template Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested template could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Template</CardTitle>
          <CardDescription>Update template information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID (Slug)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="template-id"
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Template name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="29.99"
              />
            </div>
            <div>
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input
                id="cover"
                value={formData.cover}
                onChange={(e) => handleInputChange('cover', e.target.value)}
                placeholder="/templates/cover.png"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDesc">Short Description</Label>
            <Textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => handleInputChange('shortDesc', e.target.value)}
              placeholder="Brief description of the template"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="longDesc">Long Description</Label>
            <Textarea
              id="longDesc"
              value={formData.longDesc}
              onChange={(e) => handleInputChange('longDesc', e.target.value)}
              placeholder="Detailed description of the template"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              placeholder="Feature 1, Feature 2, Feature 3"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="useCases">Use Cases (comma-separated)</Label>
            <Textarea
              id="useCases"
              value={formData.useCases}
              onChange={(e) => handleInputChange('useCases', e.target.value)}
              placeholder="Use case 1, Use case 2, Use case 3"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="images">Image URLs (comma-separated)</Label>
            <Textarea
              id="images"
              value={formData.images}
              onChange={(e) => handleInputChange('images', e.target.value)}
              placeholder="/templates/image1.png, /templates/image2.png"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="buyUrl">Buy URL (Optional)</Label>
            <Input
              id="buyUrl"
              value={formData.buyUrl}
              onChange={(e) => handleInputChange('buyUrl', e.target.value)}
              placeholder="https://gumroad.com/l/template-id or leave empty to route to /inquire"
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
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode - display template information
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{template.name}</CardTitle>
              <CardDescription className="text-lg mb-4">{template.shortDesc}</CardDescription>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  ${template.price}
                </Badge>
              </div>
              
              {/* Action Buttons - Moved to top */}
              <div className="flex space-x-4">
                {/* Buy Template Button */}
                <Button asChild variant="default" size="lg">
                  {template.buyUrl ? (
                    <a href={template.buyUrl} target="_blank" rel="noopener noreferrer">
                      Buy Template
                    </a>
                  ) : (
                    <a href={`/inquire?template=${template.id}`}>
                      Buy Template
                    </a>
                  )}
                </Button>
                
                {/* Preview Template Button - Always show */}
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild={!!template.previewUrl}
                  disabled={!template.previewUrl}
                >
                  {template.previewUrl ? (
                    <a href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                      Preview Template
                    </a>
                  ) : (
                    <span>Preview Template (Coming Soon)</span>
                  )}
                </Button>
              </div>
            </div>
            {template.cover && (
              <img 
                src={template.cover} 
                alt={template.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      {template.longDesc && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{template.longDesc}</p>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {template.features && template.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Use Cases */}
      {template.useCases && template.useCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {template.useCases.map((useCase, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Images */}
      {template.images && template.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Template Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {template.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${template.name} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 