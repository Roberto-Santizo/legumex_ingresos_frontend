import { useQuery } from "@tanstack/react-query"
import { useParams,Navigate } from "react-router-dom"

import EditVisitorForm from "../components/EditVisitorForm"
import { getVisitorByIdAPI } from "../api/VisitorsAPI"
export default function EditVisitor() {
    const params = useParams()
    const visitorId = Number(params.visitorId)

    const {data, isLoading, isError} = useQuery({
        queryKey: ['editVisitor', visitorId],
        queryFn:()=> getVisitorByIdAPI(visitorId),
        retry: false
    })
    if(isLoading) return 'cargando los datos del los visitantes'
    if(isError) return <Navigate to={'/404'}/>
    if(data) return <EditVisitorForm data={data} visitorId={visitorId}/>
}
