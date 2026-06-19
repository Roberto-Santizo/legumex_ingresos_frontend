import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Spinner } from "@/shared/components/Spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Td, TableHead, Table, TableBody, TableRow, Th, TableEmpty, TableActions,
} from "@/shared/components/ui/StyledTable";
import { searchExternalEmployeesAPI, findOrCreateEmployeeBenefitedAPI } from "../api/EmployeeBenefitedAPI";
import { STATUS_LABELS, STATUS_COLORS } from "../schema/constants";
import type { ExternalEmployee } from "../schema/types";

type Props = {
  onClose: () => void;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-GT');
}

function ExistingStatusBadge({ employee }: { employee: ExternalEmployee }) {
  if (!employee.existing_status) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${STATUS_COLORS[employee.existing_status]}`}>
      {STATUS_LABELS[employee.existing_status]}
      {employee.last_delivery_date && ` · ${formatDate(employee.last_delivery_date)}`}
    </span>
  );
}

// Modal de confirmacion mostrado al seleccionar un empleado que ya completo un ciclo de entrega
function ConfirmReopenModal({ employee, onConfirm, onClose }: { employee: ExternalEmployee; onConfirm: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-slate-800">Reabrir proceso de entrega</h2>
        <p className="text-sm text-slate-600">
          "{employee.name}" ya completó su entrega de equipo
          {employee.last_delivery_date && ` el ${formatDate(employee.last_delivery_date)}`}.
          ¿Deseas reabrir su proceso para entregarle equipo nuevamente?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
          >
            Sí, reabrir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelectEmployee({ onClose }: Props) {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [employeeToConfirm, setEmployeeToConfirm] = useState<ExternalEmployee | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["externalEmployees", debouncedSearch],
    queryFn: () => searchExternalEmployeesAPI(debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const { mutate } = useMutation({
    mutationFn: findOrCreateEmployeeBenefitedAPI,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["employeeBenefited"] });
      toast.success(result.reopened ? "Proceso reabierto, ya puedes asignarle equipo nuevamente" : "Empleado registrado correctamente");
      setPendingId(null);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al registrar el empleado");
      setPendingId(null);
    },
  });

  const runAssign = (employee: ExternalEmployee) => {
    setPendingId(employee.id);
    mutate(employee);
  };

  const handleAssign = (employee: ExternalEmployee) => {
    if (employee.existing_status === 'COMPLETED') {
      setEmployeeToConfirm(employee);
      return;
    }
    runAssign(employee);
  };

  const employees = data ?? [];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Seleccionar Empleado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="px-4 sm:px-5 pt-4 pb-2 shrink-0">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Lista de empleados */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 pb-4 sm:pb-5">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : isError ? (
            <p className="text-sm text-red-500 py-4">Error al cargar los datos.</p>
          ) : employees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <Th>Nombre del Empleado</Th>
                    <Th>Código</Th>
                    <Th>Posición</Th>
                    <Th>Departamento</Th>
                    <Th align="center">Acción</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <Td>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span>{employee.name}</span>
                          <ExistingStatusBadge employee={employee} />
                        </div>
                      </Td>
                      <Td>{employee.code}</Td>
                      <Td>{employee.position}</Td>
                      <Td>{employee.deparment.name}</Td>
                      <Td align="center">
                        <TableActions>
                          <button
                            onClick={() => handleAssign(employee)}
                            disabled={pendingId === employee.id}
                            className="px-3 py-1.5 bg-orange-400 text-white rounded-lg text-xs font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                          >
                            {pendingId === employee.id ? "Guardando..." : "Seleccionar empleado"}
                          </button>
                        </TableActions>
                      </Td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <TableEmpty message="No hay empleados registrados." />
          )}
        </div>
      </div>

      {employeeToConfirm && (
        <ConfirmReopenModal
          employee={employeeToConfirm}
          onClose={() => setEmployeeToConfirm(null)}
          onConfirm={() => {
            runAssign(employeeToConfirm);
            setEmployeeToConfirm(null);
          }}
        />
      )}
    </div>
  );
}
