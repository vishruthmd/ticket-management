
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
