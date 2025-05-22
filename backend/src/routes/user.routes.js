import express from "express";
import {
  getAllTechnicians,
  getAllCoordinators,
  createUser,
} from "../controllers/users.controllers.js";
import {
  isLoggedIn,
  isAdmin,
  isAdminOrCoordinator,
} from "../middlewares/auth.middlewares.js";
import {
  createTicketLimiter,
  updateTicketLimiter,
} from "../middlewares/rate-limit.middlewares.js";
import { validateCreateTicketInputs } from "../middlewares/auth.validator.middlewares.js";

const userRoutes = express.Router();

userRoutes.get("/all-technicians", isLoggedIn, getAllTechnicians);
userRoutes.get("/all-coordinators", isLoggedIn, getAllCoordinators);
userRoutes.post(
  "/create-user",
  createTicketLimiter,
  isLoggedIn,
  isAdmin,
  validateCreateTicketInputs,
  createUser
);

export default userRoutes;
