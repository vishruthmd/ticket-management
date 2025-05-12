import { createRateLimiter } from "../libs/rate-limitter.libs.js";

//general
const generalLimiter = createRateLimiter(20, 100);

// auth limits
const registerLimiter = createRateLimiter(3, 10);
const loginLimiter = createRateLimiter(5, 20);

// ticket limits
const createTicketLimiter = createRateLimiter(5, 10);
const updateTicketLimiter = createRateLimiter(5, 10);

export {
  registerLimiter,
  loginLimiter,
  generalLimiter,
  createTicketLimiter,
  updateTicketLimiter,
};
