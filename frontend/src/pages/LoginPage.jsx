import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore.js";
import logo from "../assets/rvce.png";

// ✅ Zod schema
const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="RVCE Logo"
            className="h-25 w-25 rounded-4xl shadow-lg border border-gray-200 bg-white object-contain"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            RVCE IT Call Log App
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Sign in to your account
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full bg-white rounded-2xl shadow-2xl px-8 py-10"
        >
          <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full pl-10 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-accent-500 focus:ring-accent-500 focus:border-accent-500' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-accent-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full pl-10 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-accent-500 focus:ring-accent-500 focus:border-accent-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <span className="text-gray-400 text-xs select-none cursor-pointer">
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-accent-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            <div>
              <motion.button
                type="submit"
                className="btn btn-primary w-full flex justify-center py-2 text-base rounded-lg shadow-sm bg-blue-600 hover:bg-primary-700 text-white font-semibold"
                disabled={isLoggingIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 