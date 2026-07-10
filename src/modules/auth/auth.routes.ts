import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;
