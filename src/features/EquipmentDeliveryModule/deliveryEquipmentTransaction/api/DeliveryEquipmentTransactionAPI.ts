import api from "shared/api/axios.ts"
import { isAxiosError } from "axios"
import type { CreateTransactionPayload, UploadFinalPhotoPayload } from "../schema/types"

export async function createEquipmentTransactionAPI(payload: CreateTransactionPayload) {
    try {
        const { data } = await api.post("/delivery-equipment-transaction", payload)
        return data.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw error
    }
}

export async function uploadEmployeeFinalPhotoAPI({ employee_benefited_id, photo_base64 }: UploadFinalPhotoPayload) {
    try {
        const { data } = await api.patch(
            `/delivery-equipment-transaction/final-photo/${employee_benefited_id}`,
            { photo_base64 }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message)
        }
        throw error
    }
}