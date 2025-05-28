import express from "express";
import { getWallet } from "../controllers/walletController.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";



const router = express.Router();

// Rota para obter o saldo da carteira do usuário
router.get("/", getWallet);

export default router
