import { asyncHandler } from "../../utils/asyncHandler";
import { propertyService } from "./property.service";
import httpStatus from "http-status";
import {
  createPropertySchema,
  propertyQuerySchema,
  updatePropertySchema,
} from "./property.validator";
import { getErrorStatusCode } from "../../utils/errorStatusCode";
import { Request, Response } from "express";

const postProperty = asyncHandler(async (req, res) => {
  const parsed = createPropertySchema.parse(req.body);
  console.log("Parsed property data:", parsed);
  try {
    const propery = await propertyService.postProperty(req.user!.id, parsed);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Property created successfully",
      statusCode: httpStatus.CREATED,
      data: propery,
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});

// List all properties
const listProperties = asyncHandler(async (req: Request, res: Response) => {
  const parsed = propertyQuerySchema.parse(req.query);

  try {
    const result = await propertyService.listProperties(parsed);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Properties retrieved successfully",
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});

// list properties by landlord
const listPropertiesByLandlord = asyncHandler(
  async (req: Request, res: Response) => {
    const landlordId = req.user!.id;
    console.log("Landlord Id: ", landlordId);

    try {
      const properties = await propertyService.listPropertiesByLandlord(
        landlordId!,
      );

      res.status(httpStatus.OK).json({
        success: true,
        message: "Properties retrieved successfully",
        statusCode: httpStatus.OK,
        data: properties,
      });
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        data: [],
      });
    }
  },
);

// get property by id
const getSinglePropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id as string;

    console.log("Id: ", propertyId);

    try {
      const property = await propertyService.getPropertyById(propertyId!);

      res.status(httpStatus.OK).json({
        success: true,
        message: "Property retrieved successfully",
        statusCode: httpStatus.OK,
        data: property,
      });
    } catch (error) {
      const statusCode = getErrorStatusCode(error);
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        data: [],
      });
    }
  },
);

const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id as string;
  const landlordId = req.user!.id;
  const parsed = updatePropertySchema.parse(req.body);

  try {
    const property = await propertyService.updateProperty(
      landlordId,
      propertyId,
      parsed,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property updated successfully",
      statusCode: httpStatus.OK,
      data: property,
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});
const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id as string;
  const landlordId = req.user!.id;
  try {
    await propertyService.deleteProperty(landlordId, propertyId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property deleted successfully",
      statusCode: httpStatus.OK,
      data: [],
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});

// Toggle availability
const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id as string;
  const landlordId = req.user!.id;

  try {
    const property = await propertyService.toggleAvailability(landlordId, propertyId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Property availability toggled successfully",
      statusCode: httpStatus.OK,
      data: property,
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      data: [],
    });
  }
});

export const propertyController = {
  postProperty,
  listProperties,
  listPropertiesByLandlord,
  getSinglePropertyById,
  updateProperty,
  deleteProperty,
  toggleAvailability,
};
