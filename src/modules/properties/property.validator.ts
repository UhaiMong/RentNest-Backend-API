import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  price: z.number().positive(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  sizeSqFt: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const propertyQuerySchema = z.object({
  location: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  sizeSqFt: z.coerce.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
