import express from "express";
import { register, login, refreshToken } from "../controllers/authController.js";
import { getSummary } from "../controllers/transactionController.js";



const router = express.Router();
//Rotas que não exigem token
router.post("/register", register);
router.post("/login", login);
router.get("/summary", getSummary);
router.post("/refresh", refreshToken);

export default router;
