import { z } from 'zod'

// Task 1.1.1.18a-18f: Form validation schemas

// Common field schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''))

export const uuidSchema = z.string().uuid('Invalid ID format')

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// User profile schema
export const userProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  timezone: z.string().optional(),
  language: z.string().optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    inApp: z.boolean(),
    digest: z.boolean(),
  }).optional(),
})

// Company schemas
export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  type: z.enum(['ipc', 'wholesaler']),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  address: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
})

// Product schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  genericName: z.string().optional(),
  atcCode: z.string().optional(),
  companyId: uuidSchema,
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).optional(),
})

// SKU schemas
export const skuSchema = z.object({
  skuCode: z.string().min(1, 'SKU code is required'),
  productId: uuidSchema,
  dosageStrength: z.string().min(1, 'Dosage strength is required'),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  packSize: z.coerce.number().positive('Pack size must be positive'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  registrationNumber: z.string().optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).optional(),
})

// Submission schemas
export const aamsSubmissionSchema = z.object({
  companyId: uuidSchema,
  skuId: uuidSchema,
  year: z.coerce.number().min(2020).max(2100),
  averageMonthlySales: z.coerce.number().min(0, 'Value must be non-negative'),
  supportingDocuments: z.array(z.string()).optional(),
})

export const msqSubmissionSchema = z.object({
  companyId: uuidSchema,
  skuId: uuidSchema,
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2100),
  quantity: z.coerce.number().min(0, 'Quantity must be non-negative'),
  supportingDocuments: z.array(z.string()).optional(),
})

export const wslSubmissionSchema = z.object({
  companyId: uuidSchema,
  skuId: uuidSchema,
  weekEndingDate: z.string().min(1, 'Week ending date is required'),
  stockLevel: z.coerce.number().min(0, 'Stock level must be non-negative'),
  supportingDocuments: z.array(z.string()).optional(),
})

// Follow-up schema
export const followUpSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().optional(),
  assignedTo: uuidSchema.optional(),
  issueReferenceType: z.string().optional(),
  issueReferenceId: uuidSchema.optional(),
})

// Meeting schema
export const meetingSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, 'Scheduled date/time is required'),
  durationMinutes: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
  location: z.string().optional(),
  meetingType: z.enum(['internal', 'external', 'virtual']),
  attendees: z.array(uuidSchema).optional(),
})

// Message schema
export const messageSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Message content is required'),
  recipients: z.array(uuidSchema).min(1, 'At least one recipient is required'),
  conversationType: z.enum(['direct', 'workflow', 'support']).optional(),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type CompanyFormData = z.infer<typeof companySchema>
export type ProductFormData = z.infer<typeof productSchema>
export type SkuFormData = z.infer<typeof skuSchema>
export type AAMSSubmissionFormData = z.infer<typeof aamsSubmissionSchema>
export type MSQSubmissionFormData = z.infer<typeof msqSubmissionSchema>
export type WSLSubmissionFormData = z.infer<typeof wslSubmissionSchema>
export type FollowUpFormData = z.infer<typeof followUpSchema>
export type MeetingFormData = z.infer<typeof meetingSchema>
export type MessageFormData = z.infer<typeof messageSchema>
