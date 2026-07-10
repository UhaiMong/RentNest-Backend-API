import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validator";
import { getErrorStatusCode } from "../../utils/errorStatusCode";
import { ApiError } from "../../utils/ApiError";
import {
  JwtPayload,
  verifyRefreshToken,
  verifyTokenAccessToken,
} from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body);
  try {
    const result = await authService.registerUser(parsed);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Registered successfully",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (error) {
    console.log("Internal server error: ", error);
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});

// Login user
const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  try {
    const result = await authService.loginUser(parsed);
    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }
});

// get refresh token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const { accessToken } = await authService.refreshAccessToken(payload);
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }
});

// Get current user
const getMe = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const accessToken = cookies?.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
  const user = verifyTokenAccessToken(accessToken);
  const userId = user?.id;
  try {
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await authService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }
});

// User Logout
const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none" as const,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none" as const,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const authController = {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
};
