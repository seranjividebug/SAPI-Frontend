import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../services/authService";

/**
 * ProtectedRoute - Role-based route protection
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render
 * @param {number} props.allowedRole - Role allowed to access (1=admin, 2=user)
 * @param {string} props.fallbackPath - Where to redirect if not authorized
 */
export default function ProtectedRoute({ children, allowedRole, fallbackPath = "/login" }) {
  const token = getToken();
  const user = getCurrentUser();

  // Not logged in or role doesn't match -> redirect to login
  if (!token || (allowedRole && user?.role !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
