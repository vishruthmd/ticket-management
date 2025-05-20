import express from "express";
import {
  getAllTechnicians,
  getAllCoordinators,
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

const userRoutes = express.Router();

userRoutes.get("/all-technicians", isLoggedIn, getAllTechnicians);
userRoutes.get("/all-coordinators", isLoggedIn, getAllCoordinators);

export default userRoutes;
