import { asyncHandler } from "../../utils/asyncHandler";
import { propertyService } from "./property.service";
import httpStatus from "http-status";
import { createPropertySchema } from "./property.validator";
import { getErrorStatusCode } from "../../utils/errorStatusCode";

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

export const propertyController = {
  postProperty,
};
