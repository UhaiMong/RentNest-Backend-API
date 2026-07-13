import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.validator";

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
  if (!categories) throw new ApiError(404, "No categories found");
  return categories;
};

// Get single category by id
const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};

// Update category
const updateCategory = async (id: string, data: UpdateCategoryInput) => {
  const category = await prisma.category.update({
    where: { id },
    data,
  });
  if (!category) throw new ApiError(404, "Category not found!");
  return category;
};

// Delete category
const deleteCategory = async (id: string) => {
  const category = await prisma.category.delete({
    where: { id },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const categoryService = {
  createCategory,
  listCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
};
