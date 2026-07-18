import Stripe from "stripe";
import { env } from "../../config/env";
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

  const amount = Math.round(rentalRequest.property.price * 100);

  const paymentIntent = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Rental payment - ${rentalRequest.property.title}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: { rentalRequestId: rentalRequest.id, tenantId },
    success_url: `${env.app_url}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.app_url}/payments/cancel`,
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

  return { payment, checkOutUrl: paymentIntent.url };
};

// Confirm/verify payment .. Just updated status without real payment checkout
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

// called from the webhook route after strip signature is verified

const handleStripeEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await prisma.payment.findUnique({
        where: { transactionId: session.id },
      });
      if (!payment) return;
      if (payment.status === "COMPLETED") return;

      let method = "card";
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      if (paymentIntentId) {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        method = intent.payment_method_types?.[0] ?? "card";
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED", paidAt: new Date(), method },
        }),
        prisma.rentalRequest.update({
          where: { id: payment.rentalRequestId },
          data: { status: "APPROVED" },
        }),
      ]);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.payment.updateMany({
        where: { transactionId: session.id, status: "PENDING" },
        data: { status: "FAILED" },
      });
      break;
    }

    default:
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
};

// Payment history by role base access: tenant-> own payment, landlord->payments on their properties, admin->all

const getPaymentHistory = async (requester: { id: string; role: string }) => {
  // ADMIN
  if (requester?.role === "ADMIN") {
    return prisma.payment.findMany({
      include: {
        rentalRequest: {
          include: {
            property: {
              select: {
                title: true,
              },
            },
            tenant: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  // LANDLORD
  if (requester?.role === "LANDLORD") {
    return prisma.payment.findMany({
      where: { rentalRequest: { property: { landlordId: requester.id } } },
      include: {
        rentalRequest: {
          include: {
            property: {
              select: {
                title: true,
              },
            },
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
    include: {
      rentalRequest: { include: { property: { select: { title: true } } } },
    },
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
    include: {
      rentalRequest: {
        include: {
          property: { select: { title: true, landlordId: true } },
          tenant: {
            select: {
              name: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      },
    },
  });
  if (!payment) throw new ApiError(404, "Payment not found");

  const isTenantOwner = payment.rentalRequest.tenantId === requester.id;
  const isLandlordOwner =
    payment.rentalRequest.property.landlordId === requester.id;
  const isAdmin = requester?.role === "ADMIN";

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
  handleStripeEvent,
};
