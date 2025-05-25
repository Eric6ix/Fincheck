import express from "express";
import { exportTransactionCSV } from "../controllers/exportController.js";
import { exportTransactionPDF } from "../controllers/exportController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/transaction/csv", exportTransactionCSV);
router.get("/transaction/pdf", exportTransactionPDF);

export default router;
