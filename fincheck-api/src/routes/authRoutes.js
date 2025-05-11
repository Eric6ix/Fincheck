import express from "express";
import { register, login } from "../controllers/authController.js";
import { getSummary } from "../controllers/transactionController.js";



const router = express.Router();
//Rotas que não exigem token
router.post("/register", register);
router.post("/login", login);
router.get("/summary", getSummary);

export default router;
