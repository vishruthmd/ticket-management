import rateLimit from "express-rate-limit";

export const createRateLimiter = (developmentLimit, productionLimit, windowMs = 60 * 1000) => {
  const maxRequests = (process.env.NODE_ENV === "production") ? productionLimit : developmentLimit;
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      error: "Too many requests. Please try again later.",
    },
  });
};
