import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import LayoutCoordinator from "./layout/LayoutCoordinator";
import CreateTicketPage from "./pages/CreateTicketPage";
import ViewTicketPage from "./pages/ViewTicketPage";
import ProtectedRoute from "./store/ProtectedRoute";
import LayoutAdmin from "./layout/LayoutAdmin";
import AssignTechnicianPage from "./pages/AssignTechnicianPage";
import ViewTicketsAdmin from "./pages/ViewTicketsAdmin";
import ViewTechniciansPage from "./pages/ViewTechniciansPage";
import ViewCoordinatorsPage from "./pages/ViewCoordinatorsPage";
import ViewTicketsTechnician from "./pages/ViewTicketsTechnician";
import LayoutTechnician from "./layout/LayoutTechnician";
import CreateUserPage from "./pages/CreateUserPage";
import ViewDepartmentTickets from "./pages/ViewDepartmentTickets";


const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              authUser ? (
                authUser.role === "COORDINATOR" ? (
                  <LayoutCoordinator />
                ) : authUser.role === "ADMIN" ? (
                  <LayoutAdmin />
                ) : authUser.role === "TECHNICIAN" ? (
                  <LayoutTechnician />
                ) : (
                  <LoginPage />
                )
              ) : (
                <LoginPage />
              )
            }
          />
        </Route>

        {/* Coordinator routes */}
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-tickets-coordinator"
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <ViewTicketPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes
          create-user
          assign-technician
          view-technicians
          view-tickets
          view-coordinators
        */}
        <Route
          path="/create-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-technician"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AssignTechnicianPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-tickets-admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewTicketsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-technicians"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewTechniciansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-coordinators"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewCoordinatorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-department-tickets"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewDepartmentTickets />
            </ProtectedRoute>
          }
        />

        {/* Technician routes */}
        <Route
          path="/view-tickets-technician"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <ViewTicketsTechnician />
            </ProtectedRoute>
          }
        />

        {/* public routes */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
