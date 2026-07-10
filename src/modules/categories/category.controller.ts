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

export const categoryController = {
  createCategory,
};
