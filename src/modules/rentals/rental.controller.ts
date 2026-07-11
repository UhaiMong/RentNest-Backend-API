import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createRentalRequestSchema,
  updateRentalStatusSchema,
} from "./rental.validator";
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
// Get own tenant rental requests
const getTenantRentalRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.id;
    try {
      const rentalRequests =
        await rentalService.getTenantRentalRequests(tenantId);
      res.status(httpStatus.OK).json({
        success: true,
        message: "Rental requests retrieved successfully",
        data: rentalRequests,
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

// Get rental request by id
const getRentalRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const rentalId = req.params.id as string;
    try {
      const request = await rentalService.getRentalRequestById(
        rentalId,
        req.user!,
      );
      res.status(httpStatus.OK).json({
        success: true,
        message: "Rental request retrieved successfully",
        statusCode: httpStatus.OK,
        data: request,
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

// Landlord
const getLandlordRentalRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const landlorId = req.user!.id as string;
    try {
      const requests = await rentalService.getLandlordRentalRequests(landlorId);

      res.status(httpStatus.OK).json({
        success: true,
        message: "Requested rental property retrieved successfully",
        statusCode: httpStatus.OK,
        data: requests,
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

// Update rental request status by landlord

const updateRentalStatus = asyncHandler(async (req: Request, res: Response) => {
  const requestId = req.params.id as string;
  const landLordId = req.user!.id;
  const parsed = updateRentalStatusSchema.parse(req.body);
  try {
    const request = await rentalService.updateRentalStatus(
      requestId,
      landLordId,
      parsed,
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: `Request ${parsed.status.toLowerCase()}`,
      statusCode: httpStatus.OK,
      data: request,
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
  getTenantRentalRequests,
  getRentalRequestById,
  getLandlordRentalRequests,
  updateRentalStatus,
};
