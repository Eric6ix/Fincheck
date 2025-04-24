import express from "express";
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js"

const router = express.Router();


router.use(authMiddleware);
router.post("/", authorizeRole("ADMIN", "DEV"), createCategory);
router.get("/", authorizeRole("ADMIN", "DEV"), getCategory);
router.put("/:id", authorizeRole("ADMIN", "DEV"), updateCategory);
router.delete("/:id", authorizeRole("ADMIN", "DEV"), deleteCategory);
export default router;
