import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { rentalController } from "./rental.controller";

const router = Router();

router.use(authenticate);

router.post("/create", authorize("TENANT"), rentalController.postRentalRequest);

export default router;
