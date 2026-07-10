import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { JwtPayload, verifyTokenAccessToken } from "../utils/jwt";
import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookieToken = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    throw new ApiError(401, "Authentication token missing");
  }

  try {
    req.user = verifyTokenAccessToken(token);
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user?.role)) {
      throw new ApiError(403, "Unauthorized");
    }
    next();
  };
