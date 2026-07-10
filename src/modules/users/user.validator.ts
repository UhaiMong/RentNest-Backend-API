import { z } from "zod";

export const userProfileUpdateSchema = z.object({
  about: z.string().optional(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
