import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import httpStatus from "http-status";
import { createPaymentSchema } from "./payment.validator";
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

//

export const paymentController = {
  createPayment,
};
