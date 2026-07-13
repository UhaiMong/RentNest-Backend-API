import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { categorySchema, updateCategorySchema } from "./category.validator";
import httpStatus from "http-status";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

const createCategory = async (req: Request, res: Response) => {
  const data = categorySchema.parse(req.body);
  try {
    const category = await categoryService.createCategory(data);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Created category successfully",
      statusCode: httpStatus.CREATED,
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};

// List all categories
const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Retrieved categories successfully",
      statusCode: httpStatus.OK,
      data: categories,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};
// Get category by id
const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.id as string;
  try {
    const category = await categoryService.getCategoryById(categoryId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Retrieved category successfully",
      statusCode: httpStatus.OK,
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};

// Update category
const updateCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id as string;
  const data = updateCategorySchema.parse(req.body);

  try {
    const category = await categoryService.updateCategory(categoryId, data);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Updated category successfully",
      statusCode: httpStatus.OK,
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};
// Deleted category
const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id as string;
  try {
    await categoryService.deleteCategory(categoryId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Deleted category successfully",
      statusCode: httpStatus.OK,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error?.message : "Something went wrong!";
    const statusCode = getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: message,
      statusCode: statusCode,
    });
  }
};

export const categoryController = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
