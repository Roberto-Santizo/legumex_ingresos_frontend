
import type {CreateEquipmentFormData} from "../schema/types"
import { toUpper } from "@/shared/helpers/textTransformUppercase"
import type {UseFormRegister, FieldErrors} from "react-hook-form"
import { ErrorMessage } from "@/shared/components/ErrorMessage"

type createCompanyFormProps = {
    register: UseFormRegister<CreateEquipmentFormData>
    errors: FieldErrors<CreateEquipmentFormData>
}

export default function CreateEquipmentForm({errors, register}:createCompanyFormProps){
    return(
        <div className="form-container">
            <div className="form-group">
                <label htmlFor="name" className="form-label">
                    Nombre del equipo
                    <span className="required">*</span>
                </label>

                <div className="input-icon-wrapper">
                    <input 
                        id= "name"
                        type="text"
                        placeholder="BOTAS INDISTRIALES"
                        className= {`form-input ${errors.equipment_name? "form-input-error" : "form-input-normal"}`}
                        {
                            ...register("equipment_name",{
                                setValueAs: toUpper,
                                required: "El nombre del equipo es obligatorio",
                            })
                        }
                    />
                </div>
                {errors.equipment_name && (
                    <ErrorMessage>{errors.equipment_name.message} </ErrorMessage>
                )}
            </div>
            
            <div className="form-group">
                <label htmlFor="description" className="form-label">
                    Descripción del equipo
                    <span className="required">*</span>
                </label>

                <div className="input-icon-wrapper">
                    <input 
                        id= "description"
                        type="text"
                        placeholder="Talla 42, color negro,"
                        className= {`form-input ${errors.equipment_description? "form-input-error" : "form-input-normal"}`}
                        {
                            ...register("equipment_description",{
                                setValueAs: toUpper,
                                required: "La descripción del equipo es obligatoria",
                            })
                        }
                    />
                </div>
                {errors.equipment_description && (
                    <ErrorMessage>{errors.equipment_description.message} </ErrorMessage>
                )}
            </div>

        </div>
    )
}
