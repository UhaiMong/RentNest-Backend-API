import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import httpStatus from "http-status";
import { confirmPaymentSchema, createPaymentSchema } from "./payment.validator";
import { paymentService } from "./payment.service";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

// Create payment intent
const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createPaymentSchema.parse(req.body);
  const tenantId = req.user!.id;
  try {
    const result = await paymentService.createPaymentIntent(tenantId, parsed);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Payment intent created",
      statusCode: httpStatus.CREATED,
      data: result,
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

// Confirm/Verify payment
const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const parsed = confirmPaymentSchema.parse(req.body);
  try {
    const payment = await paymentService.confirmPayment(parsed.paymentIntentId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment confirmed, rental is now Aproved",
      statusCode: httpStatus.OK,
      data: payment,
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

// Get payment history role base access:
const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
  const requester = req.user!;
  try {
    const payments = await paymentService.getPaymentHistory(requester);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment history",
      statusCode: httpStatus.OK,
      data: payments,
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

export const paymentController = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
};
