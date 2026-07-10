import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { propertyController } from "./property.controller";

const router = Router();

router.use(authenticate, authorize("LANDLORD"));

router.post("/", propertyController.postProperty);
router.get("/", propertyController.listPropertiesByLandlord);
export default router;
