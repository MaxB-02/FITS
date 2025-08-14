'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * TemplateCard component for displaying template information
 * @param {Object} template - Template object with id, name, price, shortDesc, cover
 */
export function TemplateCard({ template }) {
  return (
    <Link href={`/templates/${template.id}`} className="block group">
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
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {template.shortDesc}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 