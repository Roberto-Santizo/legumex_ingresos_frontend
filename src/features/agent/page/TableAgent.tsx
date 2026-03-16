import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import PaginationComponent from "@/shared/components/PaginationComponent";
import {TableContainer,TableHeader, Table,TableHead,TableBody,TableRow,Th,Td,TableEmpty,TableActions,} from "@/shared/components/ui/StyledTable";
import { getAgentAPI } from "../api/agentAPI";



export default function TableAgent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["agents", currentPage, pageSize],
    queryFn: () => getAgentAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (isLoading) return <p>Cargando agentes...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const agents = data?.response || [];
  const totalPages = data?.lastPage || 1;

  if (data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <TableContainer>
          <TableHeader 
            title="Lista de Agentes" 
            linkTo="/agent/create" 
            linkText="Crear agente" 
          />

          {agents.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <Th>Id</Th>
                  <Th>Nombre</Th>
                  <Th align="center">Acciones</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <Td>{agent.id}</Td>
                    <Td>{agent.name}</Td>
                    <Td align="center">
                      <TableActions>
                        <Link
                          to={`/agent/${agent.id}/edit`}
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
            <TableEmpty message="No hay agentes registrados" />
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