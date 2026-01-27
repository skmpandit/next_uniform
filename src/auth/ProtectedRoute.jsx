import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <div>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}