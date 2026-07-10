import { Router } from "express";
import { propertyController } from "./property.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize("LANDLORD"),
  propertyController.postProperty,
);
// List(Public)
router.get("/", propertyController.listProperties);

// Protected route
router.get(
  "/:landlordId",
  authenticate,
  authorize("LANDLORD"),
  propertyController.listPropertiesByLandlord,
);

export default router;
