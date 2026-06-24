
import { Link } from "react-router-dom";
import { Spinner } from "@/shared/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Pencil, Search, X } from "lucide-react";

import { Td, TableHead, TableContainer, TableHeader, Table, TableBody, TableRow, Th, TableEmpty, TableActions } from "@/shared/components/ui/StyledTable";
import PaginationComponent from "@/shared/components/PaginationComponent";
import {getEquipmentWithFiltersAPI} from "../api/EquipmentAPI"


export default function TableEquipment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["equipments", currentPage, debouncedSearch],
    queryFn: () => getEquipmentWithFiltersAPI({
      page: currentPage,
      name: debouncedSearch || undefined,
    }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <Spinner fullScreen />;
  if (isError) return <p>Error al cargar los datos.</p>;

  const equipments = data?.response || [];
  const totalPages = data?.lastPage || 1;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer className="table-container">
          <TableHeader title="Lista de equipos">
            <Link to="/equipment/create" className="btn-primary whitespace-nowrap">
              Crear Equipo
            </Link>
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
            {equipments.length > 0 ? (
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <Th>ID</Th>
                    <Th>Nombre del Equipo</Th>
                    <Th>Descripción</Th>
                    <Th>Equipo Creada Por:</Th>
                    <Th>Acciones</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipments.map((equipment) => (
                    <TableRow key={equipment.equipment_id}>
                      <Td>{equipment.equipment_id}</Td>
                      <Td>{equipment.equipment_name}</Td>
                      <Td>{equipment.equipment_description}</Td>
                      <Td>{equipment.created_by ?? "—"}</Td>
                      <Td align="center">
                        <TableActions>
                          <Link
                            to={`/equipment/${equipment.equipment_id}/edit`}
                            className="btn-icon btn-icon-primary"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </Link>
                        </TableActions>
                      </Td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <TableEmpty message="No hay equipos registradas." />
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
  );
}
