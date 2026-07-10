import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { propertyController } from "./property.controller";

const router = Router();

router.use(authenticate, authorize("LANDLORD"));

router.post("/", propertyController.postProperty);
router.get("/", propertyController.listPropertiesByLandlord);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);
export default router;
