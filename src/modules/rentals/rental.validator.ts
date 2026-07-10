import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid(),
  moveInDate: z.coerce.date(),
  message: z.string().max(500).optional(),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum([
    RentalStatus.PENDING,
    RentalStatus.APPROVED,
    RentalStatus.REJECTED,
    RentalStatus.CANCELLED,
  ]),
});

export type CreateRentalRequestInput = z.infer<
  typeof createRentalRequestSchema
>;
export type UpdateRentalStatusInput = z.infer<typeof updateRentalStatusSchema>;
