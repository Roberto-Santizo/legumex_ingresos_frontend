import { useState,useEffect } from "react";
import { Pencil, Search, X } from "lucide-react";
import { Spinner } from "@/shared/components/Spinner";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { useQuery } from "@tanstack/react-query";
import { Td, TableHead, TableContainer, TableHeader, Table, TableBody, TableRow, Th, TableEmpty, TableActions } from "@/shared/components/ui/StyledTable";
import { STATUS_LABELS, STATUS_COLORS } from "../schema/constants";
import type { EmployeeBenefited } from "../schema/types";
import SelectEmployee from "./SelectEmployee";
import AssignEquipmentModal from "../../deliveryEquipmentTransaction/page/AssignEquipmentModal";
import FinalPhotoModal from "../../deliveryEquipmentTransaction/page/FinalPhotoModal";
import { getEmployeeBenefitedFilterAPI } from "../api/EmployeeBenefitedAPI";

export default function EmployeeBenefitedTable() {
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeBenefited | null>(null);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);  
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employeeBenefited", currentPage, searchInput],
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

            <div className="overflow-x-auto">
              {employees.length > 0 ? (
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
                          </TableActions>
                        </Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <TableEmpty message="No hay empleados con equipo asignado." />
              )}
            </div>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
          </TableContainer>
        </div>
      </div>

      {showModal && (
        <SelectEmployee onClose={() => setShowModal(false)} />
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
    </>
  );
}
