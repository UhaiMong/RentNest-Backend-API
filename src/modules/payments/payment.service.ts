import stripe from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreatePaymentInput } from "./payment.validator";

const createPaymentIntent = async (
  tenantId: string,
  data: CreatePaymentInput,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: data.rentalRequestId },
    include: { property: true, payment: true },
  });

  if (!rentalRequest) throw new ApiError(404, "Rental request not found");
  if (rentalRequest.tenantId !== tenantId)
    throw new ApiError(403, "This is not your rental request");
  if (rentalRequest.status !== "APPROVED") {
    throw new ApiError(
      400,
      "Payment can only be made for an approved rental request",
    );
  }
  if (rentalRequest.payment) {
    throw new ApiError(409, "A payment already exists for this rental request");
  }

  const amount = Math.round(rentalRequest.property.price * 100); // cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "bdt",
    metadata: { rentalRequestId: rentalRequest.id, tenantId },
    automatic_payment_methods: { enabled: true },
  });

  const payment = await prisma.payment.create({
    data: {
      transactionId: paymentIntent.id,
      amount: rentalRequest.property.price,
      provider: "STRIPE",
      status: "PENDING",
      rentalRequestId: rentalRequest.id,
    },
  });

  return { payment, clientSecret: paymentIntent.client_secret };
};

export const paymentService = {
  createPaymentIntent,
};
