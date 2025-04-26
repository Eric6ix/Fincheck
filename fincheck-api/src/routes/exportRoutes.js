import express from "express";
import { exportTransaction } from "../controllers/exportTransactionController.js";
import { exportTransactionCSV } from "../controllers/exportController.js";
import { exportTransactionPDF } from "../controllers/exportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/transaction", authorizeRole("ADMIN", "DEV"), exportTransaction);
router.get('/transaction/csv', exportTransactionCSV);
router.get('/transaction/pdf', exportTransactionPDF);

export default router;
