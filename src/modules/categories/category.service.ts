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

// List all categories
const listCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { propertyType: "asc" },
  });
  if (!categories) throw new Error("No categories found");
  return categories;
};

export const categoryService = {
  createCategory,
  listCategories,
};
