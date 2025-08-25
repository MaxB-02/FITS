'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const serviceOptions = [
  'Custom Dashboard',
  'Workflow Automation',
  'Data Processing',
  'Report Generation',
  'Integration Setup',
  'Other'
];

export function InquiryForm({ templateId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    services: [],
    description: '',
    hasExistingSystem: false,
    sheetUrl: '',
    budgetLow: '',
    budgetHigh: '',
    desiredDate: '',
    templateId: templateId || ''
  });

  // Update templateId when prop changes
  useEffect(() => {
    if (templateId) {
      setFormData(prev => ({ ...prev, templateId }));
    }
  }, [templateId]);

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.description) {
      try {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, and Description).",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
        alert("Please fill in all required fields (Name, Email, and Description).");
      }
      return;
    }

    // Budget validation
    if (formData.budgetLow && formData.budgetHigh && parseFloat(formData.budgetLow) > parseFloat(formData.budgetHigh)) {
      try {
        toast({
          title: "Validation Error",
          description: "Budget high must be greater than or equal to budget low.",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
        alert("Budget high must be greater than or equal to budget low.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('company', formData.company || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('description', formData.description);
      submitData.append('hasExistingSystem', formData.hasExistingSystem ? 'on' : 'off');
      submitData.append('budgetLow', formData.budgetLow || '');
      submitData.append('budgetHigh', formData.budgetHigh || '');
      submitData.append('desiredDate', formData.desiredDate || '');
      submitData.append('templateId', formData.templateId || '');
      
      // Add services
      formData.services.forEach(service => {
        submitData.append('services', service);
      });

      // Add file if exists
      const fileInput = document.getElementById('fileUpload');
      if (fileInput && fileInput.files[0]) {
        submitData.append('file', fileInput.files[0]);
      }

      const response = await fetch('/api/inquire', {
        method: 'POST',
        body: submitData, // Don't set Content-Type header for FormData
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          try {
            toast({
              title: "Success!",
              description: "Your inquiry has been submitted successfully. Redirecting...",
            });
          } catch (toastError) {
            console.error('Toast error:', toastError);
            alert("Success! Your inquiry has been submitted successfully. Redirecting...");
          }
          
          // Wait a moment for the toast to show, then redirect
          setTimeout(() => {
            try {
              router.push('/thank-you');
            } catch (routerError) {
              console.error('Router error:', routerError);
              // Fallback: use window.location
              window.location.href = '/thank-you';
            }
          }, 1500);
        } else {
          throw new Error(result.error || 'Failed to submit inquiry');
        }
      } else {
        let errorMessage = 'Failed to submit inquiry';
        try {
          const result = await response.json();
          errorMessage = result.error || errorMessage;
        } catch (parseError) {
          console.log('⚠️ Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Error submitting inquiry:', error);
      try {
        toast({
          title: "Error",
          description: error.message || "Failed to submit inquiry. Please try again.",
          variant: "destructive"
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
        alert(`Error: ${error.message || "Failed to submit inquiry. Please try again."}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell me about your project</CardTitle>
        <CardDescription>
          The more detail you give, the faster I can send you a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="inquiryForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company / Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Scope</h3>
            
            <div>
              <Label>What services do you need? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {serviceOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceChange(service)}
                    />
                    <Label htmlFor={service}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Describe your project *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell me what you're trying to achieve, what problems you're solving, and what success looks like..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasExistingSystem"
                  checked={formData.hasExistingSystem}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasExistingSystem: checked }))}
                />
                <Label htmlFor="hasExistingSystem">Do you have an existing file or system?</Label>
              </div>
              
              {formData.hasExistingSystem && (
                <div>
                  <Label htmlFor="fileUpload">Upload File</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".csv,.xlsx,.xls,.ods,.png,.jpg,.pdf"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: CSV, Excel, OpenDocument, PNG, JPG, PDF
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="sheetUrl">Existing Sheet URL (optional)</Label>
                <Input
                  id="sheetUrl"
                  type="url"
                  value={formData.sheetUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, sheetUrl: e.target.value }))}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  If you have an existing spreadsheet or document, paste the URL here
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Budget & Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetLow">Budget Low (USD)</Label>
                <Input
                  id="budgetLow"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.budgetLow}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetLow: e.target.value }))}
                  placeholder="500"
                />
              </div>
              
              <div>
                <Label htmlFor="budgetHigh">Budget High (USD)</Label>
                <Input
                  id="budgetHigh"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.budgetHigh}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetHigh: e.target.value }))}
                  placeholder="2000"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="desiredDate">Desired completion date</Label>
              <Input
                id="desiredDate"
                type="date"
                value={formData.desiredDate}
                onChange={(e) => setFormData(prev => ({ ...prev, desiredDate: e.target.value }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Inquiry'
            )}
          </Button>
          
          {isSubmitting && (
            <p className="text-sm text-center text-gray-500">
              Submitting your inquiry... Please wait.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 