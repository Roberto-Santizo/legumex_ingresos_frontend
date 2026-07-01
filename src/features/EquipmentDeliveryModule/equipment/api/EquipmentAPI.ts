import api from "shared/api/axios.ts";
import { isAxiosError } from "axios";
import type{ CreateEquipmentFormData,GetAllEquipmentListData } from "../schema/types.ts";
import { getAllEquipmentPaginatedSchema, getEquipmentByIdSchema,getAllEquipmentListSchema } from "../schema/types.ts";

export async function createEquipmentAPI(formData: CreateEquipmentFormData) {
     try{
        const {data} = await api.post("/equipment", formData);
        return data;
    }catch(error){
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function getEquipmentWithFiltersAPI(filters: {
    name?: string,
    page?: number
}){
    try{
        const limit = 10;
        const {data} = await api.get("/equipment", {
            params: {
                limit,
                page: filters.page,
                name: filters.name || undefined,
            }
        });
        const response = getAllEquipmentPaginatedSchema.safeParse(data);
        if(response.success){
            return response.data;
        }
        throw new Error("Respuesta del servidor inesperada");
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
        throw error;
    }
}

export async function getAllEquipmentAPI(): Promise<GetAllEquipmentListData> {
    try {
        const { data } = await api.get("/equipment", {
            params: {
                all: true
            }
        })

        const response = getAllEquipmentListSchema.safeParse(data.response)

        if (!response.success) {
            throw new Error("Respuesta del servidor inesperada")
        }

        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function getEquipmentByIdAPI(equipmentId: number){
    try{
        const {data}= await api.get(`/equipment/${equipmentId}`);
        const response = getEquipmentByIdSchema.safeParse(data.data);
        if(!response.success){
            throw new Error("Respuesta del servidor inesperada");
        }
        return response.data;
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}

type EquipmentAPIType = {
    equipment_id: number,
    formData: CreateEquipmentFormData
}
export async function updateEquipmentAPI({equipment_id, formData}: EquipmentAPIType){
    try{
        const {data} = await api.patch(`/equipment/${equipment_id}`, formData);
        return data;
    }catch(error){
            if(isAxiosError(error) && error.response){
                throw new Error(error.response.data.message)
            }
    }
}