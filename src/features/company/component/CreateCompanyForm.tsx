import type {CreateCompanyFormData} from  "@/features/company/schema/types"
import { toUpper } from "@/shared/helpers/textTransformUppercase"
import type {UseFormRegister, FieldErrors} from "react-hook-form"
import { ErrorMessage } from "@/shared/components/ErrorMessage"

type createCompanyFormProps = {
    register: UseFormRegister<CreateCompanyFormData>
    errors: FieldErrors<CreateCompanyFormData>
}

export default function CreateCompanyForm({errors, register}:createCompanyFormProps){
    return(
        <div className="form-container">
            <div className="form-group">
                <label htmlFor="name" className="form-label">
                    Nombre de la empresa
                    <span className="required">*</span>
                </label>

                <div className="input-icon-wrapper">
                    <input 
                        id= "name"
                        type="text"
                        placeholder="NM Solution"
                        className= {`form-input ${errors.name? "form-input-error" : "form-input-normal"}`}
                        {
                            ...register("name",{
                                setValueAs: toUpper,
                                required: "El nombre de la empresa es obligatorio",
                            })
                        }
                    />
                </div>
                {errors.name && (
                    <ErrorMessage>{errors.name.message} </ErrorMessage>
                )}
            </div>

        </div>
    )
}
