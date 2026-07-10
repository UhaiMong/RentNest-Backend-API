import { prisma } from "../../lib/prisma";
import { CreateCategoryInput } from "./category.validator";

const createCategory = async (data: CreateCategoryInput) => {
  const category = await prisma.category.create({
    data: {
      propertyType: data.propertyType,
      usageType: data.usageType,
    },
  });
  return category;
};

export const categoryService = {
  createCategory,
};
