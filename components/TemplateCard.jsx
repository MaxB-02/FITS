'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart } from 'lucide-react';

/**
 * TemplateCard component for displaying template information
 * @param {Object} template - Template object with id, name, price, shortDesc, cover
 */
export function TemplateCard({ template }) {
  const hasPreviewUrl = template.previewUrl && template.previewUrl.trim();
  const hasBuyUrl = template.buyUrl && template.buyUrl.trim();

  return (
    <Card className="h-full transition-all duration-200 hover:translate-y-[-4px] hover:ring-2 hover:ring-emerald-500/20 hover:shadow-lg">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={template.cover || 'https://picsum.photos/seed/template/600'}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/seed/template/600';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-emerald-600 transition-colors">
              {template.name}
            </h3>
            <Badge variant="secondary" className="text-sm font-medium">
              ${template.price}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {template.shortDesc}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {hasPreviewUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="flex-1"
              >
                <a 
                  href={template.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </Button>
            )}
            
            {hasBuyUrl ? (
              <Button 
                size="sm" 
                asChild
                className="flex-1"
              >
                <a 
                  href={template.buyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </a>
              </Button>
            ) : (
              <Button 
                size="sm" 
                asChild
                className="flex-1"
              >
                <Link href={`/inquire?template=${template.id}`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Customize
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 