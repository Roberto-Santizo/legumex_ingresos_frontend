import { useFormContext, Controller, useFieldArray } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Select from "react-select"
import { Plus, Trash2 } from "lucide-react"
import { ErrorMessage } from "@/shared/components/ErrorMessage"
import { searchableSelectStyles, getSelectClassNames } from "@/shared/components/ui/searchableSelectStyles"
import type { CheckInFormData } from "@/features/visits/schema/Types"
import { getAgentForSelectAPI } from "@/features/agent/api/agentAPI"
import { getVisitorPersonsByVisitorAPI } from "@/features/visits/api/VisitAPI"

type CheckInFormProps = {
    visitorId: number
}

export default function CheckInForm({ visitorId }: CheckInFormProps) {
    const { register, control, formState: { errors } } = useFormContext<CheckInFormData>()
    const { fields, append, remove } = useFieldArray({ control, name: "companions" })

    const { data: agents } = useQuery({
        queryKey: ["agent-select"],
        queryFn: getAgentForSelectAPI,
    })

    const { data: visitorPersons } = useQuery({
        queryKey: ["visitor-persons-select", visitorId],
        queryFn: () => getVisitorPersonsByVisitorAPI(visitorId),
        enabled: !!visitorId,
    })

    const agentOptions = agents?.map(a => ({ value: a.id, label: a.name })) ?? []
    const personOptions = visitorPersons?.map(p => ({ value: p.id, label: `${p.name} - DPI: ${p.document_number}` })) ?? []

    return (
        <div className="form-container">

            <div className="form-group">
                <label className="form-label">
                    Persona que llegó <span className="required">*</span>
                </label>
                <Controller
                    name="visitor_person_id"
                    control={control}
                    rules={{ required: "Debe seleccionar la persona que llegó" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={personOptions}
                            placeholder="Seleccionar persona..."
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No hay personas registradas para este visitante"}
                            value={personOptions.find(o => o.value === field.value) || null}
                            onChange={selected => field.onChange(selected?.value ?? null)}
                            classNames={getSelectClassNames(!!errors.visitor_person_id)}
                            styles={searchableSelectStyles}
                        />
                    )}
                />
                {errors.visitor_person_id && <ErrorMessage>{errors.visitor_person_id.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label htmlFor="entry_time" className="form-label">
                    Hora de entrada <span className="required">*</span>
                </label>
                <input
                    id="entry_time"
                    type="time"
                    className={`form-input ${errors.entry_time ? "form-input-error" : "form-input-normal"}`}
                    {...register("entry_time", { required: "La hora de entrada es obligatoria" })}
                />
                {errors.entry_time && <ErrorMessage>{errors.entry_time.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label htmlFor="badge_number" className="form-label">
                    Número de gafete <span className="required">*</span>
                </label>
                <input
                    id="badge_number"
                    type="text"
                    placeholder="Ej. G-045"
                    className={`form-input ${errors.badge_number ? "form-input-error" : "form-input-normal"}`}
                    {...register("badge_number", { required: "El número de gafete es obligatorio" })}
                />
                {errors.badge_number && <ErrorMessage>{errors.badge_number.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <label className="form-label">
                    Agente que registra <span className="required">*</span>
                </label>
                <Controller
                    name="agent_id"
                    control={control}
                    rules={{ required: "El agente es obligatorio" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={agentOptions}
                            placeholder="Seleccionar agente..."
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No hay agentes disponibles"}
                            value={agentOptions.find(o => o.value === field.value) || null}
                            onChange={selected => field.onChange(selected?.value ?? null)}
                            classNames={getSelectClassNames(!!errors.agent_id)}
                            styles={searchableSelectStyles}
                        />
                    )}
                />
                {errors.agent_id && <ErrorMessage>{errors.agent_id.message}</ErrorMessage>}
            </div>

            <div className="form-group">
                <div className="flex items-center justify-between mb-2">
                    <label className="form-label mb-0">Acompañantes</label>
                    <button
                        type="button"
                        onClick={() => append({ visitor_person_id: 0, badge_number: "" })}
                        className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                        <Plus size={16} /> Agregar acompañante
                    </button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Sin acompañantes</p>
                )}

                {fields.map((field, index) => (
                    <div key={field.id} className="border border-slate-200 rounded-lg p-3 mb-2 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Acompañante {index + 1}</span>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <Controller
                            name={`companions.${index}.visitor_person_id` as any}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: f }) => (
                                <Select
                                    {...f}
                                    options={personOptions}
                                    placeholder="Seleccionar persona..."
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => "No hay personas disponibles"}
                                    value={personOptions.find(o => o.value === f.value) || null}
                                    onChange={selected => f.onChange(selected?.value ?? null)}
                                    styles={searchableSelectStyles}
                                />
                            )}
                        />
                        <input
                            type="text"
                            placeholder="Número de gafete (Ej. G-046)"
                            className="form-input form-input-normal"
                            {...register(`companions.${index}.badge_number` as any, { required: true })}
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}
