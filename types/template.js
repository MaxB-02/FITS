import { z } from 'zod';

/**
 * Zod schema for template validation
 */
export const TemplateSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be kebab-case (lowercase, numbers, hyphens only)'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be a positive number'),
  shortDesc: z.string().min(1, 'Short description is required'),
  longDesc: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  useCases: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  cover: z.string().optional().default('https://picsum.photos/seed/template/600'),
  previewUrl: z.string().optional(),
  purchaseUrl: z.string().optional(),
  buyUrl: z.string().optional(),
  active: z.boolean().default(false),
  updatedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional()
});

/**
 * Type for template data (derived from schema)
 */
export const Template = TemplateSchema;

/**
 * Type for creating a new template (all fields optional except required ones)
 */
export const CreateTemplateSchema = TemplateSchema.pick({
  id: true,
  name: true,
  price: true,
  shortDesc: true,
  longDesc: true,
  features: true,
  useCases: true,
  images: true,
  cover: true,
  previewUrl: true,
  purchaseUrl: true,
  buyUrl: true,
  active: true
}).extend({
  // Handle both string and array inputs for these fields
  features: z.union([
    z.string().transform(val => val ? val.split(',').map(item => item.trim()).filter(item => item) : []),
    z.array(z.string())
  ]).optional().default([]),
  useCases: z.union([
    z.string().transform(val => val ? val.split(',').map(item => item.trim()).filter(item => item) : []),
    z.array(z.string())
  ]).optional().default([]),
  images: z.union([
    z.string().transform(val => val ? val.split(',').map(item => item.trim()).filter(item => item) : []),
    z.array(z.string())
  ]).optional().default([]),
  price: z.union([
    z.string().transform(val => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        throw new Error('Price must be a valid positive number');
      }
      return num;
    }),
    z.number().positive('Price must be a positive number')
  ])
});

/**
 * Type for updating an existing template (all fields optional)
 */
export const UpdateTemplateSchema = TemplateSchema.partial().omit({
  id: true,
  createdAt: true
}); 