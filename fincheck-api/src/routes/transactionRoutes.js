import express from "express";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  exportTransactionsCSV,
  exportTransactionsPDF,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getSummary } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/export/pdf", authMiddleware, exportTransactionsPDF);
router.get("/export/csv", authMiddleware, exportTransactionsCSV);
router.get("/summary", authMiddleware, getSummary);
router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, createTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
