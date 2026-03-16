import { useFormContext, Controller } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Select from "react-select"
import { ErrorMessage } from "@/shared/components/ErrorMessage"
import { toUpper } from "@/shared/helpers/textTransformUppercase"
import { searchableSelectStyles, getSelectClassNames } from "@/shared/components/ui/searchableSelectStyles"
import type { CreateVisitFormData } from "@/features/visits/schema/Types"
import { getVisitorsForSelectAPI } from "@/features/visits/api/VisitAPI"
import { departmentForSelectAPI } from "@/features/department/api/departmentAPI"

export default function CreateVisitForm() {
    const { register, control, formState: { errors } } = useFormContext<CreateVisitFormData>()

    const { data: visitors } = useQuery({
        queryKey: ["visitors-select"],
        queryFn: getVisitorsForSelectAPI,
    })

    const { data: departments } = useQuery({
        queryKey: ["department-select"],
        queryFn: departmentForSelectAPI,
    })

    const visitorOptions = visitors?.map(v => ({ value: v.id, label: v.name })) ?? []
    const departmentOptions = departments?.map(d => ({ value: d.id, label: d.name })) ?? []

    return (
        <div className="form-container">

            <div className="form-group">
                <label className="form-label">
                    Visitante / Empresa <span className="required">*</span>
                </label>
                <Controller
                    name="visitor_id"
                    control={control}
                    rules={{ required: "El visitante es obligatorio" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={visitorOptions}
                            placeholder="Buscar empresa o proveedor..."
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No se encontraron visitantes"}
                            value={visitorOptions.find(o => o.value === field.value) || null}
                            onChange={selected => field.onChange(selected?.value ?? null)}
                            classNames={getSelectClassNames(!!errors.visitor_id)}
                            styles={searchableSelectStyles}
                        />
                    )}
                />
                {errors.visitor_id && <ErrorMessage>{errors.visitor_id.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label htmlFor="date" className="form-label">
                    Fecha de visita <span className="required">*</span>
                </label>
                <input
                    id="date"
                    type="date"
                    className={`form-input ${errors.date ? "form-input-error" : "form-input-normal"}`}
                    {...register("date", { required: "La fecha es obligatoria" })}
                />
                {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label className="form-label">
                    Departamento destino <span className="required">*</span>
                </label>
                <Controller
                    name="department_id"
                    control={control}
                    rules={{ required: "El departamento es obligatorio" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={departmentOptions}
                            placeholder="Seleccionar departamento..."
                            isClearable
                            noOptionsMessage={() => "No hay departamentos disponibles"}
                            value={departmentOptions.find(o => o.value === field.value) || null}
                            onChange={selected => field.onChange(selected?.value ?? null)}
                            classNames={getSelectClassNames(!!errors.department_id)}
                            styles={searchableSelectStyles}
                        />
                    )}
                />
                {errors.department_id && <ErrorMessage>{errors.department_id.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label htmlFor="responsible_person" className="form-label">
                    Persona responsable <span className="required">*</span>
                </label>
                <input
                    id="responsible_person"
                    type="text"
                    placeholder="Nombre de quien recibe la visita"
                    className={`form-input ${errors.responsible_person ? "form-input-error" : "form-input-normal"}`}
                    {...register("responsible_person", {
                        setValueAs: toUpper,
                        required: "La persona responsable es obligatoria",
                    })}
                />
                {errors.responsible_person && <ErrorMessage>{errors.responsible_person.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label htmlFor="destination" className="form-label">
                    Destino / Área <span className="required">*</span>
                </label>
                <input
                    id="destination"
                    type="text"
                    placeholder="Ej. Oficina de Gerencia, Bodega 2..."
                    className={`form-input ${errors.destination ? "form-input-error" : "form-input-normal"}`}
                    {...register("destination", {
                        setValueAs: toUpper,
                        required: "El destino es obligatorio",
                    })}
                />
                {errors.destination && <ErrorMessage>{errors.destination.message}</ErrorMessage>}
            </div>

        </div>
    )
}
