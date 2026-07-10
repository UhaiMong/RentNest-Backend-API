import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();
router.post("/create", categoryController.createCategory);
router.get("/list", categoryController.listCategories);

export default router;
