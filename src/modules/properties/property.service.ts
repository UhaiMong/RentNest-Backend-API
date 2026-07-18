import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import {
  CreatePropertyInput,
  PropertyQueryInput,
  UpdatePropertyInput,
} from "./property.validator";

const postProperty = async (landlordId: string, data: CreatePropertyInput) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) throw new ApiError(404, "Category not found");
  const property = await prisma.property.create({
    data: { ...data, landlordId: landlordId },
  });
  return property;
};

// Public browse + filter and pagination
const listProperties = async (query: PropertyQueryInput) => {
  const {
    location,
    categoryId,
    minPrice,
    maxPrice,
    propertyType,
    usageType,
    bedrooms,
    amenities,
    page,
    limit,
  } = query;

  const where: Prisma.PropertyWhereInput = {
    isAvailable: true,
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(categoryId && { categoryId }),
    ...(bedrooms && { bedrooms }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    }),
    ...(amenities &&
      (() => {
        const amenitiesArray: string[] = Array.isArray(amenities)
          ? amenities.map((a) => a.trim())
          : String(amenities)
              .split(",")
              .map((a: string) => a.trim());
        return {
          amenities: { hasEvery: amenitiesArray },
        };
      })()),
    ...(propertyType && { category: { propertyType } }),
    ...(usageType && { category: { usageType } }),
  };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        category: true,
        landlord: { select: { id: true, name: true, phone: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// By Landord id
const listPropertiesByLandlord = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: { landlordId },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return properties;
};

// Propert id
const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id: id },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, phone: true, email: true } },
      reviews: { include: { tenant: { select: { id: true, name: true } } } },
    },
  });
  if (!property) throw new ApiError(404, "Property not found");
  return property;
};

const updateProperty = async (
  landlordId: string,
  propertyId: string,
  data: UpdatePropertyInput,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new ApiError(404, "Property not found");

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { ...data, landlordId },
  });

  return updatedProperty;
};

const deleteProperty = async (landlordId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new ApiError(404, "Property not found");

  // Check if the landlord is the owner of the property
  if (property.landlordId !== landlordId) {
    throw new ApiError(403, "You are not the owner of this property");
  }

  await prisma.property.delete({
    where: { id: propertyId },
  });
};

const toggleAvailability = async (landlordId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new ApiError(404, "Property not found");

  if (property.landlordId !== landlordId) {
    throw new ApiError(403, "You are not the owner of this property");
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { isAvailable: !property.isAvailable },
  });

  return updatedProperty;
};

export const propertyService = {
  postProperty,
  listProperties,
  listPropertiesByLandlord,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleAvailability,
};
