import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize("TENANT"),
  reviewController.createReview,
);
router.get(
  "/mine",
  authenticate,
  authorize("TENANT"),
  reviewController.getMyReviews,
);
router.get("/property/:propertyId", reviewController.getPropertyReviews);

export default router;
