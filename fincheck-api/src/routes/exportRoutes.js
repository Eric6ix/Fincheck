import express from "express";
import { exportTransactionCSV } from "../controllers/exportController.js";
import { exportTransactionPDF } from "../controllers/exportController.js";

const router = express.Router();


router.get("/transaction/csv", exportTransactionCSV);
router.get("/transaction/pdf", exportTransactionPDF);

export default router;
