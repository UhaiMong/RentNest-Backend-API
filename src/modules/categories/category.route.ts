import { Router } from "express";
import { categoryController } from "./category.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
// protected: ADMIN only
router.use(authenticate, authorize("ADMIN"));

router.post("/create", categoryController.createCategory);
router.get("/list", categoryController.listCategories);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
