import { createRateLimiter } from "../libs/rate-limitter.js";

const registerLimiter = createRateLimiter(3, 10);
const loginLimiter = createRateLimiter(5, 20);
const generalLimiter = createRateLimiter(20, 100);

export { registerLimiter, loginLimiter, generalLimiter };
