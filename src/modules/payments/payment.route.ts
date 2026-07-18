import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize("TENANT"),
  paymentController.createPayment,
);
router.post(
  "/confirm",
  authenticate,
  authorize("TENANT"),
  paymentController.confirmPayment,
);
router.post("/webhook", paymentController.stripeWebHook);
router.get("/", authenticate, paymentController.getPaymentHistory);
router.get("/:id", authenticate, paymentController.getPaymentById);
export default router;
