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
                  <LayoutCoordinator/>
                ) : authUser.role === "ADMIN" ? (
                  <LayoutAdmin />
                ) : authUser.role === "Technician" ? (
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

        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-tickets"
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <ViewTicketPage />
            </ProtectedRoute>
          }
        />
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
