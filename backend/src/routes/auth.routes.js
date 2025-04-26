import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", authMiddleware, logoutUser);
authRoutes.get("/me", authMiddleware, getMe);

export default authRoutes;
