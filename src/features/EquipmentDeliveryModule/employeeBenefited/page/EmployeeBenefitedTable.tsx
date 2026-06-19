import { useState,useEffect } from "react";
import { History, Pencil, Search, Trash2, X } from "lucide-react";
import { Spinner } from "@/shared/components/Spinner";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Td, TableHead, TableContainer, TableHeader, Table, TableBody, TableRow, Th, TableEmpty, TableActions } from "@/shared/components/ui/StyledTable";
import { STATUS_LABELS, STATUS_COLORS } from "../schema/constants";
import type { EmployeeBenefited } from "../schema/types";
import SelectEmployee from "./SelectEmployee";
import AssignEquipmentModal from "../../deliveryEquipmentTransaction/page/AssignEquipmentModal";
import FinalPhotoModal from "../../deliveryEquipmentTransaction/page/FinalPhotoModal";
import EmployeeDeliveryHistoryModal from "../../deliveryEquipmentTransaction/page/EmployeeDeliveryHistoryModal";
import { getEmployeeBenefitedFilterAPI, deleteEmployeeBenefitedAPI } from "../api/EmployeeBenefitedAPI";
import { useAuth } from "@/hooks/useAuth";

// Modal de confirmacion mostrado al presionar el boton de eliminar
function ConfirmDeleteEmployeeBenefitedModal({ employee, onClose }: { employee: EmployeeBenefited; onClose: () => void }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEmployeeBenefitedAPI(employee.employee_benefited_id),
    onError: (error: Error) => {
      toast.error(error.message);
      onClose();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employeeBenefited"] });
      toast.success(data.message);
      onClose();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-slate-800">Eliminar empleado</h2>
        <p className="text-sm text-slate-600">
          ¿Estás seguro de eliminar a "{employee.employee_name}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeBenefitedTable() {
  const { permissions } = useAuth();
  const canDeleteEmployeeBenefited = permissions.includes("employeeBenefited:delete");
  const canViewDeliveryHistory = permissions.includes("deliveryTransaction:view");

  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeBenefited | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeBenefited | null>(null);
  const [employeeHistory, setEmployeeHistory] = useState<EmployeeBenefited | null>(null);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);  
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employeeBenefited", currentPage, debouncedSearch],
    queryFn: () => getEmployeeBenefitedFilterAPI({
      page: currentPage,
      name: debouncedSearch || undefined,
    }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <Spinner fullScreen />;
  if (isError) return <p>Error al cargar los datos.</p>;

  const employees = data?.response ?? [];
  const totalPages = data?.lastPage || 1;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
        <div className="max-w-6xl w-full">
          <TableContainer>
            <TableHeader title="Empleados con Equipo">
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary whitespace-nowrap"
              >
                Dar equipo a empleado
              </button>
            </TableHeader>

            <div className="relative w-full sm:max-w-sm mb-2 mt-2 ml-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre..."
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

            {employees.length > 0 ? (
              <>
                {/* Tarjetas para móvil */}
                <div className="sm:hidden space-y-3 px-2 pb-2">
                  {employees.map((employee) => (
                    <div
                      key={employee.employee_benefited_id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{employee.employee_name}</p>
                          <p className="text-xs text-gray-500">{employee.employee_code}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[employee.status]}`}>
                          {STATUS_LABELS[employee.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{employee.department_name}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {employee.status !== 'COMPLETED' && (
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="btn-icon btn-icon-primary"
                            title={
                              employee.status === 'DELIVER_EQUIPMENT' ? 'Asignar material' :
                              employee.status === 'FINAL_PHOTO' ? 'Subir foto final' :
                              'Ver entrega'
                            }
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {canViewDeliveryHistory && (
                          <button
                            onClick={() => setEmployeeHistory(employee)}
                            className="btn-icon btn-icon-primary"
                            title="Ver historial de entregas"
                          >
                            <History size={16} />
                          </button>
                        )}
                        {canDeleteEmployeeBenefited && employee.status === 'DELIVER_EQUIPMENT' && (
                          <button
                            onClick={() => setEmployeeToDelete(employee)}
                            className="btn-icon btn-icon-danger"
                            title="Eliminar empleado"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabla para tablet y escritorio */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <Th>Nombre del Empleado</Th>
                        <Th>Código</Th>
                        <Th>Departamento</Th>
                        <Th align="center">Estado</Th>
                        <Th align="center">Acciones</Th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.employee_benefited_id}>
                          <Td>{employee.employee_name}</Td>
                          <Td>{employee.employee_code}</Td>
                          <Td>{employee.department_name}</Td>
                          <Td align="center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[employee.status]}`}>
                              {STATUS_LABELS[employee.status]}
                            </span>
                          </Td>
                          <Td align="center">
                            <TableActions>
                              {employee.status !== 'COMPLETED' && (
                                <button
                                  onClick={() => setSelectedEmployee(employee)}
                                  className="btn-icon btn-icon-primary"
                                  title={
                                    employee.status === 'DELIVER_EQUIPMENT' ? 'Asignar material' :
                                    employee.status === 'FINAL_PHOTO' ? 'Subir foto final' :
                                    'Ver entrega'
                                  }
                                >
                                  <Pencil size={16} />
                                </button>
                              )}
                              {canViewDeliveryHistory && (
                                <button
                                  onClick={() => setEmployeeHistory(employee)}
                                  className="btn-icon btn-icon-primary"
                                  title="Ver historial de entregas"
                                >
                                  <History size={16} />
                                </button>
                              )}
                              {canDeleteEmployeeBenefited && employee.status === 'DELIVER_EQUIPMENT' && (
                                <button
                                  onClick={() => setEmployeeToDelete(employee)}
                                  className="btn-icon btn-icon-danger"
                                  title="Eliminar empleado"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </TableActions>
                          </Td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <TableEmpty message="No hay empleados con equipo asignado." />
            )}
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
          </TableContainer>
        </div>
      </div>

      {showModal && (
        <SelectEmployee onClose={() => { setShowModal(false); setCurrentPage(1); }} />
      )}

      {selectedEmployee?.status === 'DELIVER_EQUIPMENT' && (
        <AssignEquipmentModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {selectedEmployee?.status === 'FINAL_PHOTO' && (
        <FinalPhotoModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {employeeToDelete && (
        <ConfirmDeleteEmployeeBenefitedModal
          employee={employeeToDelete}
          onClose={() => setEmployeeToDelete(null)}
        />
      )}

      {employeeHistory && (
        <EmployeeDeliveryHistoryModal
          employee={employeeHistory}
          onClose={() => setEmployeeHistory(null)}
        />
      )}
    </>
  );
}
