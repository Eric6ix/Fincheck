import express from "express";
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();


router.use(authMiddleware);
router.post("/", createCategory);
router.get("/", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", authMiddleware, checkRole("ADMIN", "DEV"), deleteCategory);
export default router;
