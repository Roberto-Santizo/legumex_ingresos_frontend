import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { getDepartmentAPI } from "../api/departmentAPI";
import {TableContainer,TableHeader,Table,TableHead,TableBody,TableRow,Th,Td,TableEmpty,TableActions,
} from "@/shared/components/ui/StyledTable";

export default function DepartmentTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["departments", currentPage, pageSize],
    queryFn: () => getDepartmentAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (isLoading) return <p>Cargando departamentos...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const departments = data?.response || [];
  const totalPages = data?.lastPage || 1;

  if (data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer>
          <TableHeader 
            title="Lista de departamentos" 
            linkTo="/department/create" 
            linkText="Crear Departamento" 
          />

          {departments.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <Th>Id</Th>
                  <Th>Código</Th>
                  <Th>Nombre</Th>
                  <Th align="center">Acciones</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <Td>{department.id}</Td>
                    <Td>{department.code}</Td>
                    <Td>{department.name}</Td>
                    <Td align="center">
                      <TableActions>
                        <Link
                          to={`/department/${department.id}/edit`}
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
            <TableEmpty message="No hay departamentos registrados." />
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