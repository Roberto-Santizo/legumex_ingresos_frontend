import api from "@/shared/api/axios";
import { isAxiosError } from "axios";
import type { CreateUserFormData } from "@/features/users/schemas/types";
import { getUserSchema,getUserByIdSchema } from "@/features/users/schemas/types";


export async function createUserAPI(formData: CreateUserFormData) {
  try {
    const { data } = await api.post("/user", formData);
      return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
  }
}

export async function getUsersAPI(page: number = 1) {
  try {
    const limit = 10;
    const { data } = await api.get("/user", { params: { page, limit } });
    const response = getUserSchema.safeParse(data);

    if (!response.success) {
      console.error("Error de validación:", response.error.issues);
      throw new Error("Error al validar los datos de usuarios");
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function getUserById(userId:number) {
  try {
    const {data} = await api.get(`user/${userId}`);
    const response = getUserByIdSchema.safeParse(data.data);
    if(!response.success) {
      console.error("Error de validación:", response.error.issues);
      throw new Error("Error al validar los datos del usuario")
    }
    return response.data
  } catch (error) {
    if(isAxiosError(error) && error.response)
      throw new Error(error.response.data.message)
    throw error
  }
}

type UserAPIType = {
  userId: number;
  formData:CreateUserFormData;
}
export async function updateUserAPI({userId, formData}:UserAPIType) {
  try {
    const {data} = await api.patch(`user/${userId}`, formData)
    return data
  } catch (error) {
    if(isAxiosError(error)&& error.response)
      throw new Error(error.response.data.message)
  }
}