import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/getDashboardPath";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this route isn't for their role (e.g. a mechanic
  // hitting a customer-only page) — send them to their own dashboard
  // instead of silently bouncing to the public homepage, which used to
  // look like the click "did nothing".
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;