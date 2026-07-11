// Tenant submit a rental request for a property

import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import {
  CreateRentalRequestInput,
  UpdateRentalStatusInput,
} from "./rental.validator";

const postRentalRequest = async (
  tenantId: string,
  data: CreateRentalRequestInput,
) => {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
  });
  if (!property) throw new ApiError(404, "Property not found");
  if (property.landlordId === tenantId)
    throw new ApiError(
      400,
      "You cannot submit a rental request for your own property",
    );
  const duplicateRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: data.propertyId,
      status: "PENDING",
    },
  });
  if (duplicateRequest)
    throw new ApiError(
      400,
      "You have already submitted a rental request for this property",
    );
  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      message: data.message,
      moveInDate: data.moveInDate,
      status: "PENDING",
    },
    include: {
      property: true,
      tenant: true,
    },
  });
};

// Tenant view own rental requests
const getTenantRentalRequests = async (tenantId: string) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: { tenantId },
    include: { property: { include: { category: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });
  return rentalRequests;
};

const getRentalRequestById = async (
  id: string,
  requester: { id: string; role: string },
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      payment: true,
    },
  });
  if (!request) throw new ApiError(404, "Rental request not found");

  const isTenantOwner = request.tenantId === requester.id;
  const isLandlordOwner = request.property.landlordId === requester.id;
  const isAdmin = requester.role === "ADMIN";
  if (!isTenantOwner && !isLandlordOwner && !isAdmin) {
    throw new ApiError(403, "You do not have access to this rental request");
  }
  return request;
};

// Landlord: view all requests by their properties
export const getLandlordRentalRequests = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: { property: { landlordId } },
    include: {
      property: true,
      tenant: {
        select: { id: true, name: true, email: true, phone: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
// Landlord approve/reject a request status
const updateRentalStatus = async (
  id: string,
  landlordId: string,
  data: UpdateRentalStatusInput,
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true },
  });
  if (!request) throw new ApiError(404, "Rental request not found");
  if (request.property.landlordId !== landlordId) {
    throw new ApiError(403, "You do not own the property for this request");
  }
  if (request.status !== "PENDING") {
    throw new ApiError(
      400,
      `Request already ${request.status.toLowerCase()}, cannot change status`,
    );
  }

  return prisma.rentalRequest.update({
    where: { id },
    data: { status: data.status },
  });
};

export const rentalService = {
  postRentalRequest,
  getTenantRentalRequests,
  getRentalRequestById,
  getLandlordRentalRequests,
  updateRentalStatus,
};
