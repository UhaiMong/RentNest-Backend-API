import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createRentalRequestSchema } from "./rental.validator";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

const postRentalRequest = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createRentalRequestSchema.parse(req.body);
  const tenantId = req.user!.id;
  try {
    const rentalRequest = await rentalService.postRentalRequest(
      tenantId,
      parsed,
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Rental request created successfully",
      data: rentalRequest,
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

export const rentalController = {
  postRentalRequest,
};
