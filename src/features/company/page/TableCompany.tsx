import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { Td,TableHead,  TableContainer, TableHeader,Table,TableBody,TableRow,Th,TableEmpty,TableActions, } from "@/shared/components/ui/StyledTable";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { getCompanyAPI } from "../api/companyAPI";


export default function CompanyTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["companies", currentPage, pageSize],
    queryFn: () => getCompanyAPI(currentPage),
  });

  if (isLoading) return <p>Cargando empresas...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const companies = data?.response || [];
  const totalPages = data?.lastPage || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer className="table-container">
          <TableHeader 
            title="Lista de empresas" 
            linkTo="/company/create" 
            linkText="Crear empresa" 
          />
          <div className="overflow-x-auto">
            {companies.length > 0 ? (
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <Th>ID</Th>
                    <Th>Nombre de la Empresa</Th>
                    <Th>Acciones</Th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <Td >{company.id}</Td>
                      <Td>{company.name}</Td>
                    <Td align="center">
                      <TableActions>
                        <Link
                          to={`/company/${company.id}/edit`}
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
