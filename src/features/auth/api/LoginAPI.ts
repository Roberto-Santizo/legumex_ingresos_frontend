
import api from "@/shared/api/axios";
import { isAxiosError } from "axios";
import type { LoginRequest,LoginResponse } from "@/features/auth/schemas/types";
import { loginRequestSchema,loginResponseSchema } from "@/features/auth/schemas/types";

export type LoginApiError = Error & { status: number };

export async function loginApi(formData: LoginRequest): Promise<LoginResponse> {
  try {
    const parsedData = loginRequestSchema.parse(formData);
    const { data } = await api.post("/login", parsedData);
    const parsedResponse = loginResponseSchema.parse(data);
    return parsedResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const err = new Error(error.response.data.message) as LoginApiError;
      err.status = error.response.status;
      throw err;
    }
    throw error;
  }
}

