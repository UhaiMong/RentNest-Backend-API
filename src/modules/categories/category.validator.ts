import { z } from "zod";
import { PropertyType, UsageType } from "../../../generated/prisma/enums";
export const categorySchema = z.object({
  propertyType: z.enum([
    PropertyType.APARTMENT,
    PropertyType.HOUSE,
    PropertyType.SHOP,
    PropertyType.STUDIO,
    PropertyType.SUPER_SHOP,
    PropertyType.OFFICE,
    PropertyType.OTHER,
  ]),
  usageType: z.enum([
    UsageType.COMMERCIAL,
    UsageType.RESIDENTIAL,
    UsageType.NON_RESIDENTIAL,
    UsageType.OTHER,
  ]),
});
export const updateCategorySchema = categorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export type CreateCategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
