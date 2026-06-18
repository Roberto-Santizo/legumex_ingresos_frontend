import api from "@/shared/api/axios"
import { isAxiosError } from "axios"

export async function ExcelEquipmentReportAPI(params: { from: string; to: string }) {
    try {
        const { data } = await api.get("/equipment-reports/excel", {
            params,
            responseType: "blob",
        })
        return data as Blob
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.message)
        }
        throw error
    }
}
