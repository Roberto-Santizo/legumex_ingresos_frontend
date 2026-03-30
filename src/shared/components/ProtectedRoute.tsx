import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  permission?: string;
};

function ForbiddenRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("No tienes autorización para realizar esta acción.");
    navigate(-1);
  }, [navigate]);

  return null;
}

export default function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, loading, permissions } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (permission && !permissions.includes(permission)) {
    return <ForbiddenRedirect />;
  }

  return <Outlet />;
}
