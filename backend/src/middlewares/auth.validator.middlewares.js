import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createUserSchema,
} from "../libs/auth.validator.libs.js";

const validateRegisterInputs = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
};

const validateCreateTicketInputs = (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
}

const validateLoginInputs = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
};

const validateUpdateProfileInputs = (req, res, next) => {
  const result = updateProfileSchema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).json({
      success: false,
      error: result.error.issues,
    });
  }
};

export {
  validateRegisterInputs,
  validateLoginInputs,
  validateUpdateProfileInputs,
  validateCreateTicketInputs
};
