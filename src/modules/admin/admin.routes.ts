import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { adminController } from "./admin.controller";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.get("/properties", adminController.getAllProperties);
router.get("/rentals", adminController.getAllRentalRequests);

export default router;
