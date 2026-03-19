import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import CrearRolForm from "@/features/roles/components/CreateRolForm";
import RolePermissionsForm from "@/features/roles/components/RolePermissionsForm";
import { createRoleAPI } from "@/features/roles/api/RolAPI";
import type { CreateRolFormData } from "@/features/roles/schemas/types";

export default function CreateRol() {
  const navigate = useNavigate();
  const [createdRoleId, setCreatedRoleId] = useState<number | null>(null);
  const [createdRoleName, setCreatedRoleName] = useState<string>("");

  const initialValues: CreateRolFormData = { name: "" };
  const { register, handleSubmit, formState: { errors } } =
    useForm<CreateRolFormData>({ defaultValues: initialValues, mode: "onChange" });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateRolFormData) => createRoleAPI(data),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(data?.message);
      setCreatedRoleId(data.data.id);
      setCreatedRoleName(data.data.name);
    },
  });

  const handleForm = async (data: CreateRolFormData) => mutate(data);

  return (
    <div className="form-page">
      <div className="form-page-inner">
        <div className="form-page-header">
          <h1 className="form-page-title">Crear Nuevo Rol</h1>
        </div>

        <div className="form-nav">
          <Link to="/role" className="form-nav-back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </Link>
        </div>

        {/* Formulario nombre del rol */}
        <div className="form-card">
          <div className="form-card-accent"></div>
          <div className="form-card-body">
            {createdRoleId ? (
              <div className="flex items-center gap-3 py-2">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-gray-700">
                  Rol creado: <span className="text-blue-700">{createdRoleName}</span>
                </span>
              </div>
            ) : (
              <form className="form-card-body" onSubmit={handleSubmit(handleForm)} noValidate>
                <CrearRolForm register={register} errors={errors} />
                <button type="submit" className="form-submit" disabled={isPending}>
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Guardando...
                    </span>
                  ) : (
                    "Crear Rol"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Panel de permisos — aparece al crear el rol */}
        {createdRoleId && (
          <>
            <div className="form-card p-6 mt-4">
              <RolePermissionsForm roleId={createdRoleId} />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/role")}
                className="form-submit"
              >
                Ir a lista de Roles
              </button>
            </div>
          </>
        )}

        {!createdRoleId && (
          <div className="form-footer">
            <p>Después de crear el rol podrás asignar los permisos</p>
          </div>
        )}
      </div>
    </div>
  );
}
