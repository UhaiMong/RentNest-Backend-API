import stripe from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreatePaymentInput } from "./payment.validator";

// Create payment intent
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

// Confirm/verify payment
const confirmPayment = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const payment = await prisma.payment.findUnique({
    where: { transactionId: paymentIntentId },
    include: { rentalRequest: true },
  });
  if (!payment)
    throw new ApiError(404, "Payment record not found for this transaction");

  if (paymentIntent.status !== "succeeded") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    throw new ApiError(
      400,
      `Payment not completed. Stripe status: ${paymentIntent.status}`,
    );
  }

  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        method: paymentIntent.payment_method_types?.[0] ?? "card",
      },
    }),
    prisma.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "APPROVED" },
    }),
  ]);

  return updatedPayment;
};

// Payment history by role base access: tenant-> own payment, landlord->payments on their properties, admin->all

const getPaymentHistory = async (requester: { id: string; role: string }) => {
  // ADMIN
  if (requester.role === "ADMIN") {
    return prisma.payment.findMany({
      include: {
        rentalRequest: {
          include: {
            property: true,
            tenant: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  // LANDLORD
  if (requester.role === "LANDLORD") {
    return prisma.payment.findMany({
      where: { rentalRequest: { property: { landlordId: requester.id } } },
      include: {
        rentalRequest: {
          include: {
            property: true,
            tenant: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // TENANT
  return prisma.payment.findMany({
    where: { rentalRequest: { tenantId: requester.id } },
    include: { rentalRequest: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  });
};

// Get payment by id
const getPaymentById = async (
  id: string,
  requester: { id: string; role: string },
) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { rentalRequest: { include: { property: true, tenant: true } } },
  });
  if (!payment) throw new ApiError(404, "Payment not found");

  const isTenantOwner = payment.rentalRequest.tenantId === requester.id;
  const isLandlordOwner =
    payment.rentalRequest.property.landlordId === requester.id;
  const isAdmin = requester.role === "ADMIN";

  if (!isTenantOwner && !isLandlordOwner && !isAdmin) {
    throw new ApiError(403, "You do not have access to this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
};
