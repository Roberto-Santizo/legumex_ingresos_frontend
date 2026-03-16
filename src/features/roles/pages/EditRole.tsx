import { useQuery } from "@tanstack/react-query"
import { useParams,Navigate } from "react-router-dom"

import EditRoleForm from "../components/EditRoleForm"
import { getRoleById } from "../api/RolAPI"

export default function EditRole() {
    const params = useParams()
    const roleId = Number(params.roleId)

    const {data, isLoading, isError} = useQuery({
        queryKey: ['editRole', roleId],
        queryFn:()=> getRoleById(roleId),
        retry: false
    })

    if(isLoading) return 'cargando los datos del rol'
    if(isError) return <Navigate to={'/404'}/>
    if(data) return <EditRoleForm data={data} roleId={roleId}/>
}
