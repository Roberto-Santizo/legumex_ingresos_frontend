
import { toUpper } from "@/shared/helpers/textTransformUppercase"
import { ErrorMessage } from "@/shared/components/ErrorMessage"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import type {CreateDepartmentFormData} from "@/features/department/schema/types"

type createDepartmentFormProps = {
    register: UseFormRegister<CreateDepartmentFormData>
    errors: FieldErrors<CreateDepartmentFormData>
}


export default function CreateDepartmentForm({errors, register}:createDepartmentFormProps) {
  return (
    <div className="form-container">
        <div className="form-group">
            <label htmlFor="name" className="form-labe">
                Nombre del departamento
                <span className="required">*</span>
            </label>

            <div className="input-icon-wrapper">
                <input 
                    type="text"
                    id="name"
                    placeholder="Informática" 
                        className= {`form-input ${errors.name? "form-input-error" : "form-input-normal"}`}
                        {
                            ...register("name",{
                                setValueAs: toUpper,
                                required: "El nombre del departamento es obligatorio",
                            })
                        }
                />
            </div>
                {errors.name && (
                    <ErrorMessage>{errors.name.message} </ErrorMessage>
                )}
        </div>
        <div className="form-group">
            <label htmlFor="code" className="form-labe">
                Código del departamento 
                <span className="required">*</span>
            </label>

            <div className="input-icon-wrapper">
                <input 
                    type="text"
                    id="code"
                    placeholder="DEP-IT" 
                        className= {`form-input ${errors.code? "form-input-error" : "form-input-normal"}`}
                        {
                            ...register("code",{
                                setValueAs: toUpper,
                                required: "El nombre del departamento es obligatorio",
                            })
                        }
                />
            </div>
                {errors.code && (
                    <ErrorMessage>{errors.code.message} </ErrorMessage>
                )}
        </div>
      
    </div>
  )
}
