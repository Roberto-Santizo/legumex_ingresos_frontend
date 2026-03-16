
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AppLayout from '@/app/layouts/AppLayout';
import { Spinner } from "@/shared/components/Spinner";

const routes = [
  { path: "/404", component: lazy(() => import("@/app/pages/NotFound")), roles: [] },
  { path: "*", component: lazy(() => import("@/app/pages/NotFound")), roles: [] },
  
  { path: "/role", component: lazy(() => import("@/features/roles/pages/TableRoleView")), roles: [] },
  { path: "/role/create", component: lazy(() => import("@/features/roles/pages/CreateRol")), roles: [] },
  { path: "/role/:roleId/edit", component: lazy(() => import("@/features/roles/pages/EditRole")), roles: [] },

  { path: "/user", component: lazy(() => import("@/features/users/pages/TableUserView")), roles: [] },
  { path: "/user/create", component: lazy(() => import("@/features/users/pages/CreateUser")), roles: [] },
  { path: "/user/:userId/edit", component: lazy(() => import("@/features/users/pages/EditUser")), roles: [] },

  { path: "/agent", component: lazy(() => import("@/features/agent/page/TableAgent")), roles: [] },
  { path: "/agent/create", component: lazy(() => import("@/features/agent/page/CreateAgent")), roles: [] },
  { path: "/agent/:agentId/edit", component: lazy(() => import("@/features/agent/page/EditAgent")), roles: [] },

  { path: "/company", component: lazy(() => import("@/features/company/page/TableCompany")), roles: [] },
  { path: "/company/create", component: lazy(() => import("@/features/company/page/CreateCompany")), roles: [] },
  { path: "/company/:companyId/edit", component: lazy(() => import("@/features/company/page/EditCompany")), roles: [] },


  { path: "/department", component: lazy(() => import("@/features/department/page/DepartmentTable")), roles: [] },
  { path: "/department/create", component: lazy(() => import("@/features/department/page/CreateDepartment")), roles: [] },
  { path: "/department/:departmentId/edit", component: lazy(() => import("@/features/department/page/EditDepartment")), roles: [] },


  { path: "/visitor", component: lazy(() => import("@/features/visitors/page/TableVisitor")), roles: [] },
  { path: "/visitor/create", component: lazy(() => import("@/features/visitors/page/CreateVisitor")), roles: [] },
  { path: "/visitor/:visitorId/edit", component: lazy(() => import("@/features/visitors/page/EditVisitor")), roles: [] },

  { path: "/report", component: lazy(() => import("@/features/visitReport/page/DashboardView")), roles: [] },

  { path: "/visits", component: lazy(() => import("@/features/visits/pages/TableVisits")), roles: [] },
  { path: "/visits/create", component: lazy(() => import("@/features/visits/pages/CreateVisit")), roles: [] },
  { path: "/visits/:visitId/checkin", component: lazy(() => import("@/features/visits/pages/CheckInView")), roles: [] },
  { path: "/visits/:visitId/checkout", component: lazy(() => import("@/features/visits/pages/CheckOutView")), roles: [] },
  { path: "/visit/:visitId/edit", component: lazy(() => import("@/features/visits/pages/EditVisit")), roles: [] },

];

export default function AdminRoutes() {
  return (
    <Route element={<AppLayout />}>
      {routes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Spinner />}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Route>
  );
}
