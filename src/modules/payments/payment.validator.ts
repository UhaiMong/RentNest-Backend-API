import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid(),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export const checkoutSchema = z.object({
  rentalRequestId: z.string().uuid(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
