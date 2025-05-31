import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getWallet,
  updateRoleUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();
// Rota para DEVS e ADMINS
router.use(authMiddleware);
router.get("/", /*authorizeRole("ADMIN", "DEV"),*/ getUser);
router.put("/:id", /*authorizeRole("ADMIN", "DEV"),*/ updateUser);
router.put("/roleUpdate/:id", updateRoleUser);
router.delete("/:id", /*authorizeRole("ADMIN", "DEV"),*/ deleteUser);
router.delete("/wallet", /*authorizeRole("ADMIN", "DEV"),*/ getWallet);

export default router;
