import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid(),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
