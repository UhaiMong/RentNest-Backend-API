import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreatePropertyInput, PropertyQueryInput } from "./property.validator";

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

const listPropertiesByLandlord = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: { landlordId },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, phone: true } },
    },
  });
  return properties;
};

export const propertyService = {
  postProperty,
  listProperties,
  listPropertiesByLandlord,
};
