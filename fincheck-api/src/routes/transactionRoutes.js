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
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

// Todas as rotas abaixo exigem token (usuário logado)
router.use(authMiddleware);
router.get("/export/pdf", exportTransactionsPDF);
router.get("/export/csv", exportTransactionsCSV);
router.get("/summary", authorizeRole("ADMIN", "DEV"), getSummary);
router.get("/", authorizeRole("ADMIN", "DEV"), getFilterTransactions);
router.post("/", authorizeRole("ADMIN", "DEV"), createTransaction);
router.put("/:id", authorizeRole("ADMIN", "DEV"), updateTransaction);
router.delete("/:id", authorizeRole("ADMIN", "DEV"), deleteTransaction);

export default router;
