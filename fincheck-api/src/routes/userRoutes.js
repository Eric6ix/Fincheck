import express from "express";
import {
  getUser,
  updateUser,
  // deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();
// Rota para DEVS
router.use(authMiddleware);
router.get("/", authorizeRole("ADMIN", "DEV"), getUser);
router.put("/:id", authorizeRole( "DEV"), updateUser);


// router.delete(
//   "/:id",
//   authorizeRole,
//   authMiddleware,
//   checkRole(["ADMIN", "DEV"]),
//   deleteUser
// );

export default router;
