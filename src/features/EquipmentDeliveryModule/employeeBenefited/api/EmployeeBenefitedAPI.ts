import api from "shared/api/axios.ts";
import { isAxiosError } from "axios";
import { externalEmployeeListSchema, employeeBenefitedListSchema, type ExternalEmployee } from "../schema/types.ts";

export async function searchExternalEmployeesAPI(searchQuery: string) {
    try {
        const { data } = await api.get("/employee-benefited/search", {
            params: { searchQuery: searchQuery || undefined }
        });
        const response = externalEmployeeListSchema.safeParse(data.data);
        if (!response.success) {
            throw new Error("Respuesta del servidor inesperada");
        }
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export async function getEmployeeBenefitedFilterAPI(filters:{name?: string, page?: number}){
    try{
        const limit = 10;
        const {data} = await api.get("/employee-benefited/", {
            params:{
                limit,
                page: filters.page,
                name: filters.name || undefined,
            }
        });
        const response = employeeBenefitedListSchema.safeParse(data);
        if(response.success){
            return response.data;
        }
        throw new Error("Respuesta del servidor inesperada");
    }catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
} 

export async function findOrCreateEmployeeBenefitedAPI(employee: ExternalEmployee & { photo_url?: string }) {
    try {
        const { data } = await api.post("/employee-benefited/find-or-create", employee);
        return data as { data: { employee_benefited_id: number }; reopened: boolean };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export async function deleteEmployeeBenefitedAPI(employeeBenefitedId: number) {
    try {
        const { data } = await api.delete(`/employee-benefited/${employeeBenefitedId}`);
        return data as { message: string };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
