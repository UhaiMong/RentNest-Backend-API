import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { registerSchema } from "./auth.validator";
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

export const authController = {
  register,
};
