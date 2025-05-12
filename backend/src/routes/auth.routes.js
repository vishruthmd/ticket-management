import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { isLoggedIn, isAdmin } from "../middlewares/auth.middlewares.js";
import {
  validateRegisterInputs,
  validateLoginInputs,
  validateUpdateProfileInputs,
} from "../middlewares/auth.validator.middlewares.js";

import {
  registerLimiter,
  loginLimiter,
  generalLimiter,
} from "../middlewares/rate-limit.middlewares.js";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  registerLimiter,
  validateRegisterInputs,
  registerUser
);
authRoutes.post("/login", loginLimiter, validateLoginInputs, loginUser);

authRoutes.use(generalLimiter); // use this limitter for all the routes below

authRoutes.post("/logout", isLoggedIn, logoutUser);
authRoutes.get("/me", isLoggedIn, getMe);
authRoutes.put(
  "/update-profile",
  isLoggedIn,
  validateUpdateProfileInputs,
  updateProfile
);


export default authRoutes;
