import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail, Check, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import {
  DEPARTMENTS,
  departmentOptions,
} from "../../../backend/src/libs/constants.js";
import { Combobox } from "@headlessui/react";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });
  const selectedRole = watch("role");
  const [query, setQuery] = useState("");

  const onSubmit = async (data) => {
    try {
      await createUser(data);
      setModalContent({ title: "User Created", message: "The user was created successfully." });
      setModalOpen(true);
      reset();
    } catch (error) {
      setModalContent({ title: "Error", message: "Failed to create user. Please try again." });
      setModalOpen(true);
    }
  };

  return (
    <div>
      <PageHeader title="Create User" description="Create a new user account" />
      <div className="flex justify-center items-center py-8">
        <Card className="w-full max-w-md p-8">
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
                  className={`w-full pl-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? "border-red-500" : ""}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  className={`w-full pl-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.role ? "border-red-500" : ""}`}
                >
                  <option value="TECHNICIAN">Technician</option>
                  <option value="ADMIN">Admin</option>
                  <option value="COORDINATOR">Coordinator</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>
            {/* Department (if coordinator) */}
            {selectedRole === "COORDINATOR" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Department</span>
                </label>
                <Combobox
                  value={departmentOptions.find((d) => d.value === watch("department")) || null}
                  onChange={(val) => setValue("department", val?.value)}
                >
                  <div className="relative">
                    <div className="relative w-full cursor-default bg-white border border-gray-300 rounded-md">
                      <Combobox.Input
                        className="w-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none py-2 px-3 rounded-md"
                        placeholder="Select Department"
                        displayValue={(option) => option?.label || ""}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-200">
                      {departmentOptions
                        .filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
                        .map((option) => (
                          <Combobox.Option
                            key={option.value}
                            value={option}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none relative px-4 py-2 rounded-md transition-colors ${
                                active ? "bg-gray-100 text-gray-900" : "bg-white text-gray-900"
                              } ${selected ? "font-semibold" : ""}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? "font-medium" : ""}`}>{option.label}</span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-4 flex items-center text-primary">
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
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
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
                  className={`w-full pl-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                  className={`w-full pl-10 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
        </Card>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-700 text-base mb-4">{modalContent.message}</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => setModalOpen(false)}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUserPage;
