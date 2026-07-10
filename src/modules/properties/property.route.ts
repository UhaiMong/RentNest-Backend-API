import { Router } from "express";
import { propertyController } from "./property.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// List(Public)
router.get("/", propertyController.listProperties);

// Get property by id
router.get("/:id", propertyController.getSinglePropertyById);

export default router;
