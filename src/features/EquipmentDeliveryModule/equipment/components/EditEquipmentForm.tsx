import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import {useForm} from 'react-hook-form'
import { toast } from "react-toastify"

import CreateEquipmentForm from "../../equipment/components/CreateEquipmentForm"
import {updateEquipmentAPI} from "../../equipment/api/EquipmentAPI"
import type { CreateEquipmentFormData, GetEquipmentByIdData } from "../../equipment/schema/types"


type EditEquipmentFormProps = {
    data: GetEquipmentByIdData
    equipment_id: number
}
export default function EditEquipmentForm({data, equipment_id}:EditEquipmentFormProps) {
    const navigate = useNavigate()

    const {register, handleSubmit, formState:{errors}} = useForm<CreateEquipmentFormData>({defaultValues:{
        equipment_name: data.equipment_name,
        equipment_description: data.equipment_description,
        created_by: ""
    }})

    const queryClient = useQueryClient();
    const {mutate,isPending} = useMutation({
        mutationFn: updateEquipmentAPI,
        onError:(error) =>{
            toast.error(error.message)
        },
        onSuccess: (data)=>{
            queryClient.invalidateQueries({queryKey:['equipments']})
            toast.success(data?.message)
            navigate('/equipment')
        }
    })

    const handleForm = (formData: CreateEquipmentFormData) =>{
        mutate({ formData, equipment_id })
    }

  if (data) return(
          <div className="form-page">
              <div className="form-page-inner">
                  <div className="form-page-header">
                      <h1 className="form-page-title">
                          Editar Equipo
                      </h1>
                  </div>
                  <div className="form-nav">
                      <Link
                          to="/equipment"
                          className="form-nav-back"
                      >
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
                      className="p-8 space-y-6"
                      onSubmit={handleSubmit(handleForm)}
                      noValidate
                      >
                      <CreateEquipmentForm register={register} errors={errors}/>
                      <button
                          type="submit"
                          className="form-submit" 
                          disabled={isPending}
                      >
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
  
                  <div className="form-footer">
                       <p>Los cambios se aplicarán inmediatamente después de guardar los cambios</p>
                  </div>
              </div>
          </div>
    )
}
