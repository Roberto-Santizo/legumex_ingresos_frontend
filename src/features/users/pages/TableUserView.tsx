import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { getUsersAPI } from "@/features/users/api/UserAPI.js";
import PaginationComponent from "@/shared/components/PaginationComponent";
import {TableContainer,TableHeader,Table,TableHead,TableBody,TableRow,Th,Td,TableEmpty,TableActions} from "@/shared/components/ui/StyledTable";

export default function UserTableView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", currentPage, pageSize],
    queryFn: () => getUsersAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const users = data?.response || [];
  const totalPages = data?.lastPage || 1;

  if (data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer>
          <TableHeader 
            title="Lista de Usuarios" 
            linkTo="/user/create" 
            linkText="Crear usuario" 
          />

          {users.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <Th>Id</Th>
                  <Th>Nombre</Th>
                  <Th>Usuario</Th>
                  <Th>Rol</Th>
                  <Th>Departamento</Th>
                  <Th align="center">Acciones</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <Td>{user.id}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.username}</Td>
                    <Td>{user.role.name}</Td>
                    <Td>{user.department.name}</Td>
                    <Td align="center">
                      <TableActions>
                        <Link
                          to={`/user/${user.id}/edit`}
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
            <TableEmpty message="No hay usuarios registrados." />
          )}

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