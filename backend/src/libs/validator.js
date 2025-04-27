import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  role: z.enum(["TECHNICIAN", "ADMIN", "COORDINATOR"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

const updateProfileSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  image: z.string().optional(),
  role: z.enum(["TECHNICIAN", "ADMIN", "COORDINATOR"]).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .optional(),
});

export { registerSchema, loginSchema, updateProfileSchema };
