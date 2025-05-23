import express from "express";
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", createCategory);
router.get("/", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
export default router;
