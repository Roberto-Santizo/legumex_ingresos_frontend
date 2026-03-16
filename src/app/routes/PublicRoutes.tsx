import { Navigate, Route } from "react-router-dom";
import PublicLayout from "@/app/layouts/PublicLayout";
import Login from "../../features/auth/pages/LoginView";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" />} index />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </>
  );
}
