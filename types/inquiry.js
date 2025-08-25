import { z } from 'zod';

/**
 * Zod schema for inquiry validation
 */
export const InquirySchema = z.object({
  id: z.string().optional(), // Will be generated
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
  services: z.array(z.string()).optional().default([]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  hasExistingSystem: z.boolean().optional().default(false),
  sheetUrl: z.string().optional(),
  filePath: z.string().optional(),
  budgetLow: z.number().positive('Budget low must be a positive number').optional(),
  budgetHigh: z.number().positive('Budget high must be a positive number').optional(),
  desiredDate: z.string().optional(),
  templateId: z.string().optional(),
  status: z.enum(['new', 'accepted', 'declined']).default('new'),
  createdAt: z.string().optional(), // Will be generated
  reviewedAt: z.string().optional()
}).refine(
  (data) => {
    if (data.budgetLow && data.budgetHigh) {
      return data.budgetHigh >= data.budgetLow;
    }
    return true;
  },
  {
    message: 'Budget high must be greater than or equal to budget low',
    path: ['budgetHigh']
  }
);

/**
 * Schema for creating a new inquiry
 */
export const CreateInquirySchema = InquirySchema.pick({
  name: true,
  email: true,
  company: true,
  phone: true,
  services: true,
  description: true,
  hasExistingSystem: true,
  sheetUrl: true,
  filePath: true,
  budgetLow: true,
  budgetHigh: true,
  desiredDate: true,
  templateId: true
});

/**
 * Schema for updating an existing inquiry
 */
export const UpdateInquirySchema = InquirySchema.partial().omit({
  id: true,
  createdAt: true
});

/**
 * @typedef {Object} Inquiry
 * @property {string} id - "inquiry-<timestamp>-<rand>"
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} [company] - Company/organization (optional)
 * @property {string} [phone] - Phone number (optional)
 * @property {string[]} [services] - Array of service names (optional)
 * @property {string} description - Project description
 * @property {boolean} [hasExistingSystem] - Whether user has existing file/system (optional)
 * @property {string} [sheetUrl] - URL to existing sheet (optional)
 * @property {string} [filePath] - Path to uploaded file (optional)
 * @property {number} [budgetLow] - Budget low end in USD (optional)
 * @property {number} [budgetHigh] - Budget high end in USD (optional)
 * @property {string} [desiredDate] - Desired completion date (optional)
 * @property {string} [templateId] - Associated template ID (optional)
 * @property {'new' | 'accepted' | 'declined'} status - Inquiry status
 * @property {string} createdAt - ISO date string
 * @property {string} [reviewedAt] - When status was changed (optional)
 */

/**
 * @typedef {Object} CreateInquiryData
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} [company] - Company/organization (optional)
 * @property {string} [phone] - Phone number (optional)
 * @property {string[]} [services] - Array of service names (optional)
 * @property {string} description - Project description
 * @property {boolean} [hasExistingSystem] - Whether user has existing file/system (optional)
 * @property {string} [sheetUrl] - URL to existing sheet (optional)
 * @property {string} [filePath] - Path to uploaded file (optional)
 * @property {number} [budgetLow] - Budget low end in USD (optional)
 * @property {number} [budgetHigh] - Budget high end in USD (optional)
 * @property {string} [desiredDate] - Desired completion date (optional)
 * @property {string} [templateId] - Associated template ID (optional)
 */

/**
 * @typedef {Object} UpdateInquiryData
 * @property {string} [name] - User's name (optional)
 * @property {string} [email] - User's email (optional)
 * @property {string} [company] - Company/organization (optional)
 * @property {string} [phone] - Phone number (optional)
 * @property {string[]} [services] - Array of service names (optional)
 * @property {string} [description] - Project description (optional)
 * @property {boolean} [hasExistingSystem] - Whether user has existing file/system (optional)
 * @property {string} [sheetUrl] - URL to existing sheet (optional)
 * @property {string} [filePath] - Path to uploaded file (optional)
 * @property {number} [budgetLow] - Budget low end in USD (optional)
 * @property {number} [budgetHigh] - Budget high end in USD (optional)
 * @property {string} [desiredDate] - Desired completion date (optional)
 * @property {string} [templateId] - Associated template ID (optional)
 * @property {'new' | 'accepted' | 'declined'} [status] - Inquiry status (optional)
 * @property {string} [reviewedAt] - When status was changed (optional)
 */

export {}; 