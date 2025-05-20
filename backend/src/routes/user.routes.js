import express from "express";
import { getAllTechnicians, getAllCoordinators } from "../controllers/users.controllers.js";
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

userRoutes.get("/all-technicians", getAllTechnicians);
userRoutes.get("/all-coordinators", getAllCoordinators);


export default userRoutes;