import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Spinner } from "@/shared/components/Spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Td, TableHead, Table, TableBody, TableRow, Th, TableEmpty, TableActions,
} from "@/shared/components/ui/StyledTable";
import { searchExternalEmployeesAPI, findOrCreateEmployeeBenefitedAPI } from "../api/EmployeeBenefitedAPI";
import type { ExternalEmployee } from "../schema/types";

type Props = {
  onClose: () => void;
};

export default function SelectEmployee({ onClose }: Props) {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeBenefited"] });
      toast.success("Empleado registrado correctamente");
      setPendingId(null);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Error al registrar el empleado");
      setPendingId(null);
    },
  });

  const handleAssign = (employee: ExternalEmployee) => {
    setPendingId(employee.id);
    mutate(employee);
  };

  const employees = data ?? [];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Seleccionar Empleado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="px-5 pt-4 pb-2 shrink-0">
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

        {/* Tabla */}
        <div className="overflow-y-auto flex-1 px-5 pb-5">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : isError ? (
            <p className="text-sm text-red-500 py-4">Error al cargar los datos.</p>
          ) : employees.length > 0 ? (
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
                    <Td>{employee.name}</Td>
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
          ) : (
            <TableEmpty message="No hay empleados registrados." />
          )}
        </div>
      </div>
    </div>
  );
}
