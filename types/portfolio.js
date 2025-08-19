import { z } from 'zod';

/**
 * Zod schema for portfolio project validation
 */
export const PortfolioSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be kebab-case (lowercase, numbers, hyphens only)'),
  title: z.string().min(1, 'Title is required'),
  shortDesc: z.string().min(1, 'Short description is required'),
  longDesc: z.string().optional(),
  cover: z.string().optional().default('https://picsum.photos/seed/template/600'),
  images: z.array(z.string()).optional().default([]),
  sheetUrl: z.string().optional(),
  buyUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  useCases: z.array(z.string()).optional().default([]),
  active: z.boolean().default(true),
  updatedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional()
});

/**
 * Type for portfolio project data (derived from schema)
 */
export const Portfolio = PortfolioSchema;

/**
 * Type for creating a new portfolio project (all fields optional except required ones)
 */
export const CreatePortfolioSchema = PortfolioSchema.pick({
  id: true,
  title: true,
  shortDesc: true,
  longDesc: true,
  cover: true,
  images: true,
  sheetUrl: true,
  buyUrl: true,
  previewUrl: true,
  useCases: true,
  active: true
}).extend({
  // Handle both string and array inputs for these fields
  useCases: z.union([
    z.string().transform(val => val ? val.split(',').map(item => item.trim()).filter(item => item) : []),
    z.array(z.string())
  ]).optional().default([]),
  images: z.union([
    z.string().transform(val => val ? val.split(',').map(item => item.trim()).filter(item => item) : []),
    z.array(z.string())
  ]).optional().default([])
});

/**
 * Type for updating an existing portfolio project (all fields optional)
 */
export const UpdatePortfolioSchema = PortfolioSchema.partial().omit({
  id: true,
  createdAt: true
}); 