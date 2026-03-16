import { isAxiosError } from "axios"
import api from "@/shared/api/axios"
import {dashboardSummarySchema,inPlantAtResponseSchema,visitsByCompanyResponseSchema} from "../schema/types"

export async function getDashboardSummaryAPI(date?: string) {
    try {
        const { data } = await api.get("/reports/dashboard-summary", { params: { date } })
        return dashboardSummarySchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function getInPlantAtAPI(params: { date: string; from: string; to: string }) {
    try {
        const { data } = await api.get("/reports/in-plant-at", { params })
        return inPlantAtResponseSchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function getVisitsByCompanyAPI(params: { from: string; to: string }) {
    try {
        const { data } = await api.get("/reports/visits-by-company", { params })
        return visitsByCompanyResponseSchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}