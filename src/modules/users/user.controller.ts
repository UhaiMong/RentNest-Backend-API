import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { verifyTokenAccessToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { userService } from "./user.service";

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { accessToken } = cookies;
  if (!accessToken) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
  const decoded = verifyTokenAccessToken(accessToken);
  const userId = decoded?.id;
  try {
    if (!userId) throw new ApiError(401, "Unauthorized access");
    const result = userService.getMe(userId);
    res.status(200).json({
      success: true,
      message: "Retrieved user profile successfully",
      data: result,
    });
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message =
      error instanceof Error ? error.message : "Something went wrong!";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }
});

export const userController = {
  getMe,
};
