import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validator";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

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

export const authController = {
  register,
  login,
};
