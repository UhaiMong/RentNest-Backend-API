import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreatePropertyInput } from "./property.validator";

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

export const propertyService = {
  postProperty,
};
