import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { propertyController } from "./property.controller";

const router = Router();

router.use(authenticate, authorize("LANDLORD"));

router.post("/create", propertyController.postProperty);
router.get("/", propertyController.listPropertiesByLandlord);
router.put("/:id/update", propertyController.updateProperty);
router.delete("/:id/delete", propertyController.deleteProperty);
export default router;
