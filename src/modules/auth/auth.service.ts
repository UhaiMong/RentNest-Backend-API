import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { LoginInput, RegisterInput } from "./auth.validator";
import { env } from "../../config/env";
import { createRefreshToken, createToken } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";

// Register user
const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
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
      phone: data?.phone,
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

// Login user
const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (user.status === "BANNED")
    throw new ApiError(403, "Your account has been banned");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const accessToken = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const refreshToken = createRefreshToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { accessToken, refreshToken };
};

// Get myself
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      properties: true,
      rentalRequests: true,
    },
  });
  if (!user) throw new ApiError(404, "User not found");

  const { password, ...safeUser } = user;
  return { user: safeUser };
};

// Refresh access token
const refreshAccessToken = async (payload: {
  id: string;
  name: string;
  email: string;
  role: Role;
}) => {
  const accessToken = createToken(payload);
  return { accessToken };
};

export const authService = {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
};
