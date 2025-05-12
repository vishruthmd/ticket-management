import { createTicketSchema, updateTicketSchema } from "../libs/ticket.validator.libs.js";

const validateCreateTicketInputs = (req, res, next) => {
  const result = createTicketSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
};

const validateUpdateTicketInputs = (req, res, next) => {
  const result = updateTicketSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
}

export { validateCreateTicketInputs, validateUpdateTicketInputs };