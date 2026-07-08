import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, "At least 5 characters required")
    .max(100, "At most 100 characters supported"),
  email: z.string().email().max(100, "At most 100 character supported"),
  password: z.string().min(6, "Mininum 6 characters required"),
  role: z.enum(["TENANT", "LANDLORD"]),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
