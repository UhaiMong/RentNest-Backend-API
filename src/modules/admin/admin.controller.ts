import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { updateUserStatusSchema } from "./admin.validation";
import { adminServices } from "./admin.service";
import httpStatus from "http-status";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await adminServices.getAllUsers();
    res.status(httpStatus.OK).json({
      success: true,
      message: "All user retrieved!",
      statusCode: httpStatus.OK,
      data: users,
    });
  } catch (error) {
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

// Update user status
const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateUserStatusSchema.parse(req.body);
  const userId = req.params.id as string;
  try {
    const user = await adminServices.updateUserStatus(userId, parsed);
    res.status(httpStatus.OK).json({
      success: true,
      message: `User ${parsed.status.toLowerCase()}`,
      statusCode: httpStatus.OK,
      data: user,
    });
  } catch (error) {
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

// get all properties

const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
  try {
    const properties = await adminServices.getAllProperties();
    res
      .status(httpStatus.OK)
      .json({ success: true, statusCode: httpStatus.OK, data: properties });
  } catch (error) {
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

// Get all rental request
const getAllRentalRequests = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const rentals = await adminServices.getAllRentalRequests();
      res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "All rental request retrieved successfully",
        data: rentals,
      });
    } catch (error) {
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
  },
);

const adminStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await adminServices.adminStats();
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
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
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  try {
    await adminServices.deleteUser(userId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Deleted user successfully",
      statusCode: httpStatus.OK,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};

export const adminController = {
  getAllUsers,
  getAllProperties,
  updateUserStatus,
  getAllRentalRequests,
  adminStats,
  deleteUser,
};
