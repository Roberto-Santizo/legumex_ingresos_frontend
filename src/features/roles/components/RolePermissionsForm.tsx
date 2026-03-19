import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAllPermissionsAPI,
  getRolePermissionsAPI,
  updateRolePermissionsAPI,
} from "../api/PermissionsAPI";

type Props = {
  roleId: number;
};

// Group permissions by module
const MODULE_LABELS: Record<string, string> = {
  users:       "Usuarios",
  roles:       "Roles",
  agents:      "Agentes",
  companies:   "Empresas",
  departments: "Departamentos",
  visitors:    "Visitantes",
  visits:      "Visitas",
  reports:     "Reportes",
};

const ACTION_LABELS: Record<string, string> = {
  "view":       "Ver",
  "view:all":   "Ver todas",
  "create":     "Crear",
  "edit":       "Editar",
  "checkin":    "Check-in",
  "checkout":   "Check-out",
  "cancel":     "Cancelar",
};

export default function RolePermissionsForm({ roleId }: Props) {
  const queryClient = useQueryClient();

  const { data: allPermissions = [], isLoading: loadingAll } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: getAllPermissionsAPI,
    staleTime: 0,
  });

  const { data: rolePermissions = [], isLoading: loadingRole } = useQuery({
    queryKey: ["role-permissions", roleId],
    queryFn: () => getRolePermissionsAPI(roleId),
  });

  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [initialized, setInitialized] = useState(false);

  // Initialize selected from fetched role permissions
  if (!initialized && rolePermissions.length > 0 && allPermissions.length > 0) {
    setSelected(new Set(rolePermissions.map((p) => p.name)));
    setInitialized(true);
  }
  if (!initialized && allPermissions.length > 0 && rolePermissions.length === 0 && !loadingRole) {
    setInitialized(true);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateRolePermissionsAPI(roleId, Array.from(selected)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions", roleId] });
      toast.success("Permisos actualizados correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const togglePermission = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleModule = (moduleName: string) => {
    const modulePerms = allPermissions
      .filter((p) => p.name.startsWith(`${moduleName}:`))
      .map((p) => p.name);
    const allSelected = modulePerms.every((p) => selected.has(p));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        modulePerms.forEach((p) => next.delete(p));
      } else {
        modulePerms.forEach((p) => next.add(p));
      }
      return next;
    });
  };

  // Group by module
  const grouped = allPermissions.reduce<Record<string, typeof allPermissions>>(
    (acc, perm) => {
      const [module] = perm.name.split(":");
      if (!acc[module]) acc[module] = [];
      acc[module].push(perm);
      return acc;
    },
    {}
  );

  if (loadingAll || loadingRole) {
    return <p className="text-sm text-gray-500">Cargando permisos...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Permisos del Rol</h2>

      {Object.entries(grouped).map(([module, perms]) => {
        const allSelected = perms.every((p) => selected.has(p.name));
        const someSelected = perms.some((p) => selected.has(p.name));

        return (
          <div key={module} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
              onClick={() => toggleModule(module)}
            >
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                onChange={() => toggleModule(module)}
                className="w-4 h-4 accent-blue-600"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-medium text-gray-700">
                {MODULE_LABELS[module] ?? module}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
              {perms.map((perm) => {
                const action = perm.name.slice(perm.name.indexOf(':') + 1);
                return (
                  <label
                    key={perm.name}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(perm.name)}
                      onChange={() => togglePermission(perm.name)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-600">
                      {ACTION_LABELS[action] ?? action}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
        className="form-submit"
      >
        {isPending ? "Guardando..." : "Guardar Permisos"}
      </button>
    </div>
  );
}
