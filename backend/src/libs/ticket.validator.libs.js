import { z } from "zod";
import { DEPARTMENTS, STATUSES, PRIORITIES } from "./constants.js";

const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  description: z
    .string()
    .min(3, "description must be atleast 3 chars long")
    .max(500, "description must be at most 500 chars long"),
  department: z.enum(DEPARTMENTS),
  deviceType: z.string().optional(),
  deviceId: z.string(),
  location: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

const updateTicketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long")
    .optional(),

  description: z
    .string()
    .min(3, "description must be atleast 3 chars long")
    .max(500, "description must be at most 500 chars long")
    .optional(),

  status: z.enum(STATUSES),
  department: z.enum(DEPARTMENTS).optional(),
  deviceType: z.string().optional(),
  deviceId: z.string().optional(),
  lab: z.string().optional(),
});

export { createTicketSchema, updateTicketSchema };
