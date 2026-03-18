import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

/**
 * Wraps login/signup pages. Redirects to /designer if already authenticated.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/designer" replace />;
  }

  return children;
}
