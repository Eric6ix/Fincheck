import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

const app = express();

dotenv.config();

app.use(express.json());


app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/export", exportRoutes);

app.use("/api/auth", authRoutes);

export default app;
