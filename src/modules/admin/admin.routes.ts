import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { adminController } from "./admin.controller";

const router = Router();

// Protected: ADMIN only
router.use(authenticate, authorize("ADMIN"));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUser);
router.get("/properties", adminController.getAllProperties);
router.get("/rentals", adminController.getAllRentalRequests);
router.get("/stats", adminController.adminStats);

export default router;
