import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoleAPI } from "@/features/roles/api/RolAPI";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { Td,TableHead,  TableContainer, TableHeader,Table,TableBody,TableRow,Th,TableEmpty,TableActions, } from "@/shared/components/ui/StyledTable";

export default function UserTableView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles", currentPage, pageSize],
    queryFn: () => getRoleAPI(currentPage),
  });

  if (isLoading) return <p>Cargando roles...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const roles = data?.response || [];
  const totalPages = data?.lastPage || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer className="table-container">
          <TableHeader 
            title="Lista de Roles" 
            linkTo="/role/create" 
            linkText="Crear role" 
          />
          <div className="overflow-x-auto">
            {roles.length > 0 ? (
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <Th>ID</Th>
                    <Th>Nombre del Rol</Th>
                    <Th>Acciones</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <Td >{role.id}</Td>
                      <Td>{role.name}</Td>
                    <Td align="center">
                      <TableActions>
                        <Link
                          to={`/role/${role.id}/edit`}
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
              <TableEmpty message="No hay usuarios registrados."/>
            )}
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </TableContainer>
      </div>
    </div>
  );
}
