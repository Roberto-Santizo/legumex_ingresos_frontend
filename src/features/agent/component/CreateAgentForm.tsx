import type { FieldErrors, UseFormRegister} from "react-hook-form";
import { toUpper } from "@/shared/helpers/textTransformUppercase";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import type { CreateAgentFormData} from "@/features/agent/schema/types";


type CreateUserFormProps = {
  register: UseFormRegister<CreateAgentFormData>;
  errors: FieldErrors<CreateAgentFormData>;
};

export default function CreateAgentForm({register,errors,}: CreateUserFormProps) {
  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Nombre y apellido
          <span className="required">*</span>
        </label>

        <div className="input-icon-wrapper">
          <input
            id="name"
            type="text"
            placeholder="Ej. LUIS"
            className={`form-input ${
              errors.name ? "form-input-error" : "form-input-normal"
            }`}
            {...register("name", {
              setValueAs: toUpper,
              required: "El nombre es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            })}
          />
        </div>
        {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
        )}
      </div>

    </div>
  );
}
