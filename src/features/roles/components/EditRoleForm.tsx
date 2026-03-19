import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import CrearRolForm from "./CreateRolForm";
import type { CreateRolFormData } from "../schemas/types";
import { updateRoleAPI } from "../api/RolAPI";

type EditRoleProps = {
    data: CreateRolFormData
    roleId: number
}

export default function EditRoleForm({ data, roleId }: EditRoleProps) {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { name: data.name }
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateRoleAPI,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess(data) {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['editRole', roleId] });
            toast.success(data.message);
            navigate('/role');
        },
    });

    const handleForm = (formData: CreateRolFormData) => {
        mutate({ formData, roleId });
    };

    return (
        <div className="form-card">
            <div className="form-card-accent"></div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit(handleForm)} noValidate>
                <CrearRolForm register={register} errors={errors} />
                <button type="submit" className="form-submit" disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Guardando...
                        </span>
                    ) : (
                        "Guardar Cambios"
                    )}
                </button>
            </form>
        </div>
    );
}
