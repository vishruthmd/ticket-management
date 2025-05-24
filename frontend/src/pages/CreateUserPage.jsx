import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import NavbarAdmin from "../components/NavbarAdmin.jsx";
import {
  DEPARTMENTS,
  departmentOptions,
} from "../../../backend/src/libs/constants.js";
import { Combobox } from "@headlessui/react"
import { Check, ChevronDown } from "lucide-react";

// ✅ Zod schema
const SignUpSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    role: z.enum(["TECHNICIAN", "ADMIN", "COORDINATOR"]),
    department: z.string().optional(), // initially optional
  })
  .superRefine((data, ctx) => {
    if (data.role === "COORDINATOR" && !data.department) {
      ctx.addIssue({
        path: ["department"],
        code: z.ZodIssueCode.custom,
        message: "Department is required for coordinators",
      });
    }
  });

const CreateUserPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser, isCreatingUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });
  const selectedRole = watch("role");
  const [query, setQuery] = useState("");

  const onSubmit = async (data) => {
    try {
      await createUser(data);
      console.log("create user Data:", data);
    } catch (error) {
      console.error("create user failed:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col pt-18">
      <NavbarAdmin />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome</h1>
              <p className="text-base-content/60">create a new account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-base-content/40" />
                </div>
                <select
                  {...register("role")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.role ? "input-error" : ""
                  }`}
                >
                  <option value="TECHNICIAN">Technician</option>
                  <option value="ADMIN">Admin</option>
                  <option value="COORDINATOR">Coordinator</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {selectedRole === "COORDINATOR" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Department</span>
                </label>
                <Combobox
                  value={
                    departmentOptions.find(
                      (d) => d.value === watch("department")
                    ) || null
                  }
                  onChange={(val) => setValue("department", val?.value)}
                >
                  <div className="relative">
                    <div className="relative w-full cursor-default input input-bordered">
                      <Combobox.Input
                        className="w-full bg-transparent focus:outline-none"
                        placeholder="Select Department"
                        displayValue={(option) => option?.label || ""}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-base-content/40" />
                      </Combobox.Button>
                    </div>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {departmentOptions
                        .filter((option) =>
                          option.label
                            .toLowerCase()
                            .includes(query.toLowerCase())
                        )
                        .map((option) => (
                          <Combobox.Option
                            key={option.value}
                            value={option}
                            className={({ active }) =>
                              `cursor-pointer select-none relative px-4 py-2 ${
                                active ? "bg-primary text-white" : ""
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : ""
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-4 flex items-center text-white">
                                    <Check className="h-4 w-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isCreatingUser}
            >
              {isCreatingUser ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
