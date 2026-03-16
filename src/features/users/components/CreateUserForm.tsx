import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState,useEffect } from "react";

import type { Role } from "@/features/roles/schemas/types";

import { rolForSelectAPI } from "@/features/roles/api/RolAPI";
import { departmentForSelectAPI } from "@/features/department/api/departmentAPI";
import type { Department } from "@/features/department/schema/types";
import { toUpper } from "@/shared/helpers/textTransformUppercase";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import type { CreateUserFormData} from "@/features/users/schemas/types";


type CreateUserFormProps = {
  register: UseFormRegister<CreateUserFormData>;
  errors: FieldErrors<CreateUserFormData>;
  showRolField?: boolean;
  setValue?: UseFormSetValue<CreateUserFormData>;
  defaultRoleId?: number;
  defaultDepartmentId?: number;
};

export default function CreateUserForm({register, errors, setValue, defaultRoleId, defaultDepartmentId}: CreateUserFormProps) {
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartment, setLoadingDepartment] = useState<boolean>(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await rolForSelectAPI();
        setRoles(data ?? []);
        if (defaultRoleId) setValue?.('role_id', defaultRoleId);
      } catch (error) {
        console.error("Error cargando roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [defaultRoleId, setValue]);

  useEffect(()=> {
    const fetchDepartments = async () =>{
      try {
        const data = await departmentForSelectAPI()
        setDepartments(data ?? []);
        if (defaultDepartmentId) setValue?.('department_id', defaultDepartmentId);
      } catch (error) {
        console.error("Error cargando departamentos", error)
      } finally{
        setLoadingDepartment(false)
      }
    };
    fetchDepartments();
  }, [defaultDepartmentId, setValue])

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

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Usuario
          <span className="required">*</span>
        </label>

        <div>
          <input
            id="username"
            type="text"
            placeholder="Ej. admin"
            className={`form-input ${
              errors.username ? "form-input-error" : "form-input-normal"
            }`}
            {...register("username", {
              required: "El username es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            })}
          />
        </div>
        {errors.username && (
            <ErrorMessage>{errors.username.message}</ErrorMessage>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password <span className="required">*</span>
        </label>
        <div className=" relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`form-input ${
              errors.password ? "form-input-error" : "form-input-normal"
            }`}
            {...register("password")}
          />
           <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
            </button>
        </div>
        {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

     <div className="form-group">
        <label htmlFor="role_id" className="form-label">
          Rol <span className="required">*</span>
        </label>

        <select
          id="role_id"
          className={`form-input ${errors.role_id ? "form-input-error" : "form-input-normal"}`}
          {...register("role_id", { required: "El rol es obligatorio" })}
          disabled={loadingRoles}
        >
          <option value="">Selecciona un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {errors.role_id && (
          <ErrorMessage>{errors.role_id.message}</ErrorMessage>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="department_id" className="form-label">
          Departamento
        </label>
        <select id="department_id"
          className={`form-input ${errors.department_id ? "form-input-error" : "form-input-normal"}`}
          {...register("department_id", { required: "El departamento es obligatorio" })}
          disabled={loadingDepartment}
          >
          <option value="">Selecciona un departamento</option>
          {departments.map((department)=>(
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
          {errors.department_id && (
          <ErrorMessage>{errors.department_id.message}</ErrorMessage>
        )}
      </div>

    </div>
  );
}
