import express from "express";
import { createCategory } from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();


router.use(authMiddleware);
router.post("/category", createCategory);
