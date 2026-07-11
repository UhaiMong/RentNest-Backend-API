import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { rentalController } from "./rental.controller";

const router = Router();

router.use(authenticate, authorize("LANDLORD"));

router.get("/", rentalController.getLandlordRentalRequests);
router.patch("/:id", rentalController.updateRentalStatus);

export default router;
