import { useQuery } from "@tanstack/react-query"
import { useParams, Navigate, Link } from "react-router-dom"

import EditRoleForm from "../components/EditRoleForm"
import RolePermissionsForm from "../components/RolePermissionsForm"
import { getRoleById } from "../api/RolAPI"

export default function EditRole() {
    const params = useParams()
    const roleId = Number(params.roleId)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editRole', roleId],
        queryFn: () => getRoleById(roleId),
        retry: false
    })

    if (isLoading) return <p>Cargando...</p>
    if (isError) return <Navigate to={'/404'} />
    if (!data) return null

    return (
        <div className="form-page">
            <div className="form-page-inner">

                <div className="form-page-header">
                    <h1 className="form-page-title">Editar Rol</h1>
                </div>

                <div className="form-nav">
                    <Link to="/role" className="form-nav-back">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Regresar
                    </Link>
                </div>

                {/* Nombre del rol */}
                <EditRoleForm data={data} roleId={roleId} />

                {/* Permisos — justo debajo del nombre */}
                <div className="form-card mt-4">
                    <div className="form-card-accent"></div>
                    <div className="p-8">
                        <RolePermissionsForm roleId={roleId} />
                    </div>
                </div>

                <div className="form-footer">
                    <p>Los cambios en permisos se aplican en el siguiente inicio de sesion del usuario</p>
                </div>

            </div>
        </div>
    )
}
