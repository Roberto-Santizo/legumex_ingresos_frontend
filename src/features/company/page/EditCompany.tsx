import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

import EditCompanyForm from "../component/EditCompanyForm";
import { getCompanyByIdAPI } from "../api/companyAPI";

export default function EditCompany() {
  const params = useParams()
  const companyId = Number(params.companyId)

  const {data, isLoading, isError} = useQuery({
    queryKey: ['editCompany', companyId],
    queryFn:()=> getCompanyByIdAPI(companyId),
    retry:false
  })

  if(isLoading) return "Cargando los datos de la empresa"
  if(isError) return <Navigate to={'/404'}/>
  if(data) return <EditCompanyForm data={data} companyId={companyId}/>
}
