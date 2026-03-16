import { isAxiosError } from "axios";
import api from "@/shared/api/axios";
import type {CreateVisitorFormData} from "@/features/visitors/schema/Types"
import {getVisitor} from "@/features/visitors/schema/Types"
import {getVisitorByIdSchema} from "@/features/visitors/schema/Types"


export async function createVisitorAPI(formData: CreateVisitorFormData ) {
    try {
        const {data} = await api.post("/visitor-person",formData)
        return data
    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function getVisitorAPI(page: number = 1) {
    try {
        const limit = 10
        const {data} = await api.get("/visitor-person", {params: {page, limit}})
        const response = getVisitor.parse(data);
        return response;  

    }catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.message)
        }
    }
}

export async function getVisitorByIdAPI(peopleId:number) {
    try {
        const {data} = await api.get(`/visitor-person/${peopleId}`)
        const response = getVisitorByIdSchema.safeParse(data.data)
        return response.data
    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.message)
        }
    }
}

type PeopleTypeAPI = {
    visitorId: number;
    formData: CreateVisitorFormData;
}

export async function updateVisitorAPI({visitorId, formData}:PeopleTypeAPI) {
    try {
        const {data} = await api.patch(`/visitor-person/${visitorId}`,formData)
        return data
    } catch (error) {
        if(isAxiosError(error)&& error.response){
            throw new Error(error.response.data.message)
        }
    }
}
