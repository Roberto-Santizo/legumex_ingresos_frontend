import {isAxiosError } from "axios";
import api from "@/shared/api/axios";
import type {CreateDepartmentFormData} from "@/features/department/schema/types"
import  {getDepartamentResponse,departmentSelectSchema, getDepartmentByIdSchema} from "@/features/department/schema/types"


export  async function createDepartmentAPI(formData:CreateDepartmentFormData ) {
    try {
        const {data} = await api.post("/department", formData)
        return data
    } catch (error) {
        if(isAxiosError(error)&& error.response){
           throw new Error(error.response.data.message)
        }
    }
}

export async function getDepartmentAPI(page: number=1) {
    try {
        const limit = 10;
        const {data} = await api.get("/department", {params:{page, limit}})
        const response = getDepartamentResponse.safeParse(data);
        
        if (!response.success) {
            console.error(response.error.issues);
            throw new Error;
        }
        return response.data;

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function departmentForSelectAPI() {
    try {
        const {data} = await api.get("/department",{params:{all:true}});
        const parsed = departmentSelectSchema
        .array()
        .safeParse(data.response)
        if(!parsed.success){
            throw new Error("Formato inválido de departamento para el select")
        }
        return parsed.data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function getDepartmentByIdAPI(departmentId:number) {
    try {
        const {data} = await api.get(`/department/${departmentId}`)
        const response = getDepartmentByIdSchema.safeParse(data.data)
        return response.data

    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}

type DepartmentTypeAPI = {
    departmentId: number;
    formData: CreateDepartmentFormData;
}
export async function updateDepartmentAPI({departmentId, formData}:DepartmentTypeAPI ) {
    try {
        const {data} = await api.patch(`/department/${departmentId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}