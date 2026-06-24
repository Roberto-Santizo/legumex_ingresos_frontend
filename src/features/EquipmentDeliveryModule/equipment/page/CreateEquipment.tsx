
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import {Link, useNavigate} from "react-router-dom"
import {toast} from "react-toastify"

import type {CreateEquipmentFormData} from "../schema/types"
import { createEquipmentAPI } from "../api/EquipmentAPI"

import CreateEquipmentForm from "../components/CreateEquipmentForm"


export default function CreateEquipment() {
  const navigate = useNavigate();
  const initialValues: CreateEquipmentFormData = {equipment_name:"", equipment_description:"", created_by:""};
  const {register, handleSubmit, formState: {errors}} = useForm({defaultValues:initialValues, mode: "onChange"})
  const queryClient = useQueryClient()

  const {mutate, isPending} = useMutation({
    mutationFn: createEquipmentAPI,
      onError:(error) => {
        toast.error(error.message)
      },
      onSuccess:(data) =>{
        queryClient.invalidateQueries({queryKey: ["equipments"]})
        toast.success(data.message)
        navigate("/equipment")
      }
  })

  const handleForm = (formData: CreateEquipmentFormData) => {
      mutate(formData)
  };

 return (
    <div className="form-page">
      <div className="form-page-inner">
        <div className="form-page-header">
          <h1 className="form-page-title">Crear Nueva Equipo</h1>
        </div>
        <div className="form-nav">
          <Link to ="/equipment" className="form-nav-back" >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
            </svg>
              Regresar
          </Link>
        </div>
        <div className="form-card">
            <div className="form-card-accent"></div>
            <form
              className="form-card-body"
              onSubmit={handleSubmit(handleForm)}
              noValidate
            >
              <CreateEquipmentForm register={register} errors={errors} />
              <button type="submit"
                className="form-submit" 
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                      Creando...
                  </span>
                    ) : (
                      "Crear Equipo"
                )}
              </button>
            </form>
        </div>

        <div className="form-footer">
          <p>Los cambios se aplicarán inmediatamente después de crear el equipo</p>
        </div>
      </div>
    </div>
  )
}
