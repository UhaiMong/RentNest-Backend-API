import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwt_secret, {
    expiresIn: env.jwt_expires_in,
  } as jwt.SignOptions);

export const createRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwt_refresh_secret, {
    expiresIn: env.jwt_refresh_expires_in,
  } as jwt.SignOptions);

// Verify access token
export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt_secret) as JwtPayload;

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt_refresh_secret) as JwtPayload;
