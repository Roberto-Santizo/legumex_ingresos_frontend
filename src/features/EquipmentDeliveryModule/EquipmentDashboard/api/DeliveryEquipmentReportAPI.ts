import { isAxiosError } from "axios"
import api from "@/shared/api/axios"
import {
    equipmentDashboardSummarySchema,
    deliveriesByEquipmentResponseSchema,
    pendingEmployeesResponseSchema,
} from "../schema/types"

export async function getEquipmentDashboardSummaryAPI(date?: string) {
    try {
        const { data } = await api.get("/equipment-reports/dashboard-summary", { params: { date } })
        return equipmentDashboardSummarySchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function getDeliveriesByEquipmentAPI(params: { from: string; to: string }) {
    try {
        const { data } = await api.get("/equipment-reports/by-equipment", { params })
        return deliveriesByEquipmentResponseSchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function getPendingEmployeesAPI() {
    try {
        const { data } = await api.get("/equipment-reports/pending-employees")
        return pendingEmployeesResponseSchema.parse(data.data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}
