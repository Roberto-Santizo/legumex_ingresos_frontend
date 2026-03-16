import api from "@/shared/api/axios.ts";
import { isAxiosError } from "axios";
import type { CreateRolFormData } from "@/features/roles/schemas/types";
import { getRoleSchema,rolResponseApiSchema,roleResponseByIdSchema } from "@/features/roles/schemas/types";

export async function createRoleAPI(formData: CreateRolFormData) {
  try {
    const { data } = await api.post("/role", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}

export async function getRoleAPI(page: number = 1){
  try {
    const limit = 10;
    const { data } = await api.get("/role", {params: { page, limit }});
    const parsedData = getRoleSchema.parse(data);
    return parsedData;

  } catch (error) {
    if(isAxiosError(error)&& error.response){
      throw new Error(error.response.data.message)
    }
  }
}

export async function rolForSelectAPI() {
  try {
    const {data} = await api.get("/role",{params:{all:true}})
    const parsed = rolResponseApiSchema.array().safeParse(data.response);
    if (!parsed.success) {
      throw new Error("Formato inválido de roles para el select")
    }
    return parsed.data;

  } catch (error) {
    if(isAxiosError(error)&& error.response){
      throw new Error(error.response.data.message)
    }
  }
}

export async function getRoleById(roleId: number) {
  try {
    const {data} =  await api.get(`role/${roleId}`);
    const response = roleResponseByIdSchema.safeParse(data.data)
    if(!response.success){
      throw new Error("Error al validar los datos del role")
    }
    return response.data
  } catch (error) {
    if(isAxiosError(error)&& error.response){
      throw new Error(error.response.data.message)
    }
  }
}

type RoleAPIType = {
  roleId: number;
  formData: CreateRolFormData;
}
export async function updateRoleAPI({roleId, formData}:RoleAPIType) {
  try {
    const {data} = await api.patch(`role/${roleId}`, formData)
    return data
  } catch (error) {
    if(isAxiosError(error)&& error.response)
      throw new Error(error.response.data.message)
  }
}