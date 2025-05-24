import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

// Layouts
import LayoutCoordinator from "./layout/LayoutCoordinator";
import LayoutAdmin from "./layout/LayoutAdmin";
import LayoutTechnician from "./layout/LayoutTechnician";

// Protected Route Component
import ProtectedRoute from "./store/ProtectedRoute";

// Pages for Coordinator
import CreateTicketPage from "./pages/CreateTicketPage";
import ViewTicketPage from "./pages/ViewTicketPage";

// Pages for Admin
import AdminDashboard from "./pages/AdminDashboard";
import AssignTechnicianPage from "./pages/AssignTechnicianPage";
import ViewTicketsAdmin from "./pages/ViewTicketsAdmin";
import ViewTechniciansPage from "./pages/ViewTechniciansPage";
import ViewCoordinatorsPage from "./pages/ViewCoordinatorsPage";
import CreateUserPage from "./pages/CreateUserPage";
import ViewDepartmentTickets from "./pages/ViewDepartmentTickets";

// Pages for Technician
import ViewTicketsTechnician from "./pages/ViewTicketsTechnician";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <Loader className="size-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={authUser ? <Navigate to={
          authUser.role === "ADMIN" ? "/admin/dashboard" :
          authUser.role === "COORDINATOR" ? "/coordinator/tickets" :
          authUser.role === "TECHNICIAN" ? "/technician/tickets" :
          "/"
        } replace /> : <LoginPage />} />
        <Route path="/signup" element={authUser ? <Navigate to={
          authUser.role === "ADMIN" ? "/admin/dashboard" :
          authUser.role === "COORDINATOR" ? "/coordinator/tickets" :
          authUser.role === "TECHNICIAN" ? "/technician/tickets" :
          "/"
        } replace /> : <SignUpPage />} />

        {/* Home Route - Redirect based on auth status and role */}
        <Route path="/" element={<Navigate to={
          authUser ? (
            authUser.role === "ADMIN" ? "/admin/dashboard" :
            authUser.role === "COORDINATOR" ? "/coordinator/tickets" :
            authUser.role === "TECHNICIAN" ? "/technician/tickets" :
            "/login"
          ) : "/login"
        } replace />} />

        {/* ADMIN ROUTES - Protected and using LayoutAdmin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="assign-technician" element={<AssignTechnicianPage />} />
          <Route path="view-technicians" element={<ViewTechniciansPage />} />
          <Route path="view-coordinators" element={<ViewCoordinatorsPage />} />
          <Route path="view-tickets-admin" element={<ViewTicketsAdmin />} />
          <Route path="department-tickets" element={<ViewDepartmentTickets />} />
        </Route>

        {/* COORDINATOR ROUTES */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <LayoutCoordinator />
            </ProtectedRoute>
          }
        >
          <Route index element={<CreateTicketPage />} />
          <Route path="create-ticket" element={<CreateTicketPage />} />
          <Route path="tickets" element={<ViewTicketPage />} />
        </Route>

        {/* TECHNICIAN ROUTES */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <LayoutTechnician />
            </ProtectedRoute>
          }
        >
          <Route index element={<ViewTicketsTechnician />} />
          <Route path="tickets" element={<ViewTicketsTechnician />} />
        </Route>

        {/* Fallback route - for any unmatched URL */}
        <Route path="*" element={<Navigate to={
            authUser ? (
              authUser.role === "ADMIN" ? "/admin/dashboard" :
              authUser.role === "COORDINATOR" ? "/coordinator/tickets" :
              authUser.role === "TECHNICIAN" ? "/technician/tickets" :
              "/login"
            ) : "/login"
          } replace />}
        />
      </Routes>
    </div>
  );
};

export default App;
