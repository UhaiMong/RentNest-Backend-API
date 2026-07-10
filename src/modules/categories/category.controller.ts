import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { categorySchema } from "./category.validator";
import httpStatus from "http-status";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

const createCategory = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await categoryService.createCategory(data);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Created category successfully",
      statusCode: httpStatus.CREATED,
      data: data,
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

export const categoryController = {
  createCategory,
  listCategories,
};
