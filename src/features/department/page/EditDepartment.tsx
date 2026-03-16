import EditDepartmentForm from "@/features/department/components/EditDepartmentForm"
import { useQuery } from "@tanstack/react-query"
import { useParams,Navigate } from "react-router-dom"
import { getDepartmentByIdAPI } from "../api/departmentAPI"


export default function EditDepartment() {
    const params = useParams()
    const departmentId = Number(params.departmentId)

    const {data, isLoading, isError} = useQuery({
        queryKey:['editDepartment',departmentId],
        queryFn:() => getDepartmentByIdAPI(departmentId),
        retry: false
    })

    if(isLoading) return "cargando los datos del departamento"
    if(isError) return <Navigate to={"/404"}/>
    if(data) return <EditDepartmentForm data={data} departmentId={departmentId}/>
}







