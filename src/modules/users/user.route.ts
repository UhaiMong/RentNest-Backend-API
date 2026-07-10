import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/me",
  authenticate,
  authorize(Role.TENANT, Role.LANDLORD),
  userController.getMe,
);

export default router;
