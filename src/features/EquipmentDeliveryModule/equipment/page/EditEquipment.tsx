import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

import EditEquipmentForm from "../components/EditEquipmentForm"
import { getEquipmentByIdAPI } from "../api/EquipmentAPI"

export default function EditEquipment() {
    const params = useParams()
    const equipmentId = Number(params.equipmentId)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editEquipment', equipmentId],
        queryFn: () => getEquipmentByIdAPI(equipmentId),
        retry: false
    })

    if (isLoading) return "Cargando los datos del equipo"
    if (isError) return <Navigate to="/404" />
    if (data) return <EditEquipmentForm data={data} equipment_id={equipmentId} />
}
