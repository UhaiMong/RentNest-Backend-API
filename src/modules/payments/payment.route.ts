import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { paymentController } from "./payment.controller";

const router = Router();

router.use(authenticate);
router.post("/create", authorize("TENANT"), paymentController.createPayment);
export default router;
