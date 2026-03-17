// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}