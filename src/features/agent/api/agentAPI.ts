import api from "@/shared/api/axios";
import { isAxiosError } from "axios";
import { z } from "zod";
import type { CreateAgentFormData } from "@/features/agent/schema/types"
import { getAgentSchema, getAgentByIdSchema } from "@/features/agent/schema/types"

const agentSelectSchema = z.object({ id: z.number(), name: z.string() })


export async function createAgentAPI(formData: CreateAgentFormData) {
    try {
        const { data } = await api.post("/agent", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getAgentAPI(page: number = 1) {
    try {
        const limit = 10;
        const { data } = await api.get("/agent", { params: { page, limit } });
        const response = getAgentSchema.safeParse(data);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getAgentByIdAPI(agentId:number) {
    try {
        const {data} = await api.get(`/agent/${agentId}`);
        const response = getAgentByIdSchema.safeParse(data.data)
        if(!response.success){
            throw new Error('Error al validar los datos del usuario')
        }
        return response.data;
    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function getAgentForSelectAPI() {
    try {
        const { data } = await api.get("/agent", { params: { all: true } })
        const parsed = agentSelectSchema.array().safeParse(data.response)
        if (!parsed.success) throw new Error("Formato inválido de agente para el select")
        return parsed.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
    }
}

type AgentAPIType = {
    agentId: number;
    formData: CreateAgentFormData;
}
export async function updateAgentAPI({agentId, formData}:AgentAPIType) {
    try {
        const {data} = await api.patch(`agent/${agentId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}