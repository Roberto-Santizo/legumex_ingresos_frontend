import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  permission?: string;
};

export default function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, loading, permissions } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
