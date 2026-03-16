import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { getUserById } from "../api/UserAPI";
import EditUserForm from "../components/EditUserForm";


export default function EditUser() {
    const params = useParams()
    const userId = Number(params.userId)

    const {data, isLoading, isError} = useQuery({
        queryKey: ['editUser', userId],
        queryFn: () => getUserById(userId),
        retry: false
    })

    if(isLoading) return "cargando los datos del usuario"
    if(isError) return <Navigate to='/404'/>
    if(data) return <EditUserForm data={data} userId = {userId}/>  
}
