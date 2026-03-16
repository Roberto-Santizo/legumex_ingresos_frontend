import { useParams } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import EditAgentForm from "../component/EditAgentForm"
import { getAgentByIdAPI } from "../api/agentAPI"
export default function EditAgent() {
    const params = useParams()
    const agentId = Number(params.agentId)

    const {data, isLoading, isError} = useQuery({
        queryKey: ['editAgent', agentId],
        queryFn:()=> getAgentByIdAPI(agentId),
        retry: false
    })

    if(isLoading) return 'cargando los datos del rol'
    if(isError) return <Navigate to={'/404'}/>
    if(data) return <EditAgentForm data={data} agentId={agentId}/>
}


