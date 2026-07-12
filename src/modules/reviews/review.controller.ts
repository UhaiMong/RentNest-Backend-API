import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createReviewSchema } from "./review.validation";
import { reviewServices } from "./review.service";
import httpStatus from "http-status";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createReviewSchema.parse(req.body);
  const userId = req.user!.id as string;
  try {
    const review = await reviewServices.createReview(userId, parsed);
    res
      .status(httpStatus.CREATED)
      .json({
        success: true,
        message: "Review submitted",
        statusCode: httpStatus.CREATED,
        data: review,
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

const getPropertyReviews = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId as string;
  try {
    const reviews = await reviewServices.getPropertyReviews(propertyId);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        message: "Property review retrieved!",
        statusCode: httpStatus.OK,
        data: reviews,
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

const getMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id as string;
  try {
    const reviews = await reviewServices.getMyReviews(userId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Tenant own reviews",
      statusCode: httpStatus.OK,
      data: reviews,
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

export const reviewController = {
  createReview,
  getPropertyReviews,
  getMyReviews,
};
