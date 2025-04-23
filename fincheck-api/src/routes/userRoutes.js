import express from "express";
import {
  getUser,
  // updateUser,
  // deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.get(
  "/",
  authorizeRole,
  authMiddleware,
  checkRole(["ADMIN", "DEV"]),
  getUser
);
// router.put(
//   "/:id",
//   authorizeRole,
//   authMiddleware,
//   checkRole(["ADMIN", "DEV"]),
//   updateUser
// );
// router.delete(
//   "/:id",
//   authorizeRole,
//   authMiddleware,
//   checkRole(["ADMIN", "DEV"]),
//   deleteUser
// );

export default router;