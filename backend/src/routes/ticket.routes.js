import express from "express";

import {
  createTicket,
  getTicketById,
  getAllTickets,
  getAllOpenTickets,
  getAllInProgressTickets,
  getAllClosedTickets,
  getAllTechnicianTickets,
  getAllCoordinatorTickets,
  setStatusToInProgress,
  setStatusToClosed,
  updateTicket,
  getAllTicketsDepartmentWise,
} from "../controllers/ticket.controllers.js";
import {
  isLoggedIn,
  isAdmin,
  isAdminOrCoordinator,
  isCoordinator,
} from "../middlewares/auth.middlewares.js";
import {
  validateCreateTicketInputs,
  validateUpdateTicketInputs,
} from "../middlewares/ticket.validator.middlewares.js";
import {
  createTicketLimiter,
  updateTicketLimiter,
} from "../middlewares/rate-limit.middlewares.js";
import { isOpen, isInProgress } from "../middlewares/ticket.middleware.js";

const ticketRoutes = express.Router();

ticketRoutes.post(
  "/create",
  createTicketLimiter,
  isLoggedIn,
  isCoordinator,
  validateCreateTicketInputs,
  createTicket
);
ticketRoutes.post(
  "/update-ticket/:id",
  updateTicketLimiter,
  isLoggedIn,
  isCoordinator,
  validateUpdateTicketInputs,
  updateTicket
);

ticketRoutes.get("/get-ticket/:id", isLoggedIn, getTicketById);
ticketRoutes.get("/get-all-tickets", isLoggedIn, getAllTickets);
ticketRoutes.get("/open-tickets", isLoggedIn, getAllOpenTickets);
ticketRoutes.get("/in-progress-tickets", isLoggedIn, getAllInProgressTickets);
ticketRoutes.get("/closed-tickets", isLoggedIn, getAllClosedTickets);
ticketRoutes.get("/technician-tickets", isLoggedIn, getAllTechnicianTickets);
ticketRoutes.get("/coordinator-tickets", isLoggedIn, getAllCoordinatorTickets);
ticketRoutes.put(
  "/set-to-in-progress/:id/:technicianId",
  isLoggedIn,
  isAdmin,
  isOpen,
  setStatusToInProgress
);
ticketRoutes.put("/set-to-closed/:id", isInProgress, setStatusToClosed);
ticketRoutes.get("/get-all-tickets-department-wise", isLoggedIn, getAllTicketsDepartmentWise);

export default ticketRoutes;
