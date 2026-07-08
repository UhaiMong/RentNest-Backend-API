import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { RegisterInput } from "./auth.validator";
import { env } from "../../config/env";

const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUniqueOrThrow({
    where: { email: data.email },
  });
  if (existing) throw new ApiError(409, "Email already registered");

  const hashedPassword = await bcrypt.hash(
    data.password,
    env.bcrypt_salt_rounds,
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      profile: {
        create: {},
      },
    },
    include: {
      profile: true,
    },
  });

  const { password, ...safeUser } = user;

  return { user: safeUser };
};

export const authService = {
  registerUser,
};
