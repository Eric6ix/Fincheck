import express from "express";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFilterTransactions,
  exportTransactionsCSV,
  exportTransactionsPDF,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getSummary } from "../controllers/transactionController.js";

const router = express.Router();

// Todas as rotas abaixo exigem token (usuário logado)
router.use(authMiddleware);
router.get("/export/pdf", exportTransactionsPDF);
router.get("/export/csv", exportTransactionsCSV);
router.get("/summary", getSummary);
router.get("/", getFilterTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
