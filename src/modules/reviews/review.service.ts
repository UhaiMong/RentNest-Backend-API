import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateReviewInput } from "./review.validation";

const createReview = async (tenantId: string, data: CreateReviewInput) => {
  const completedRental = await prisma.rentalRequest.findFirst({
    where: { tenantId, propertyId: data.propertyId, status: "APPROVED" },
  });
  if (!completedRental) {
    throw new ApiError(
      403,
      "You can only review a property after your rental is approved",
    );
  }

  const existing = await prisma.review.findFirst({
    where: { tenantId, propertyId: data.propertyId },
  });
  if (existing) throw new ApiError(409, "You already reviewed this property");

  return prisma.review.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      rating: data.rating,
      comment: data.comment,
    },
    include: { tenant: { select: { id: true, name: true } } },
  });
};

const getPropertyReviews = async (propertyId: string) => {
  return prisma.review.findMany({
    where: { propertyId },
    include: { tenant: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getMyReviews = async (tenantId: string) => {
  return prisma.review.findMany({
    where: { tenantId },
    include: {
      property: { select: { id: true, title: true, location: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewServices = {
  createReview,
  getPropertyReviews,
  getMyReviews,
};
