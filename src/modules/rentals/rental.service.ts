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
      property: { select: { title: true, price: true, location: true } },
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
  });
};

// Tenant view own rental requests
const getTenantRentalRequests = async (tenantId: string) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        select: {
          title: true,
          location: true,
          landlordId: true,
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
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
      property: {
        select: {
          title: true,
          landlordId: true,
        },
      },
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
const getLandlordRentalRequests = async (landlordId: string) => {
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
    include: {
      property: { select: { title: true, location: true, landlordId: true } },
    },
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
