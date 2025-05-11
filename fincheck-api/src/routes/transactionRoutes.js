import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  exportTransactionsPDF
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getSummary } from "../controllers/transactionController.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";


const router = express.Router();

// Todas as rotas abaixo exigem token (usuário logado)
router.use(authMiddleware);
router.get("/export/pdf", authorizeRole("ADMIN", "DEV"), exportTransactionsPDF);
router.get("/summary", authorizeRole("ADMIN", "DEV"), getSummary);
router.get("/", authorizeRole("ADMIN", "DEV"), getAllTransactions);
router.post("/", authorizeRole("ADMIN", "DEV"), createTransaction);
router.get("/", authorizeRole("ADMIN", "DEV"),getTransactions);
router.put("/:id", authorizeRole("ADMIN", "DEV"),updateTransaction);
router.delete("/:id", authorizeRole("ADMIN", "DEV"),deleteTransaction);

export default router;
