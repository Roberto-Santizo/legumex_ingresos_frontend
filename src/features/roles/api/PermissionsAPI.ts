import api from "@/shared/api/axios";
import { isAxiosError } from "axios";

export type PermissionItem = {
  id: number;
  name: string;
  description: string;
};

export async function getAllPermissionsAPI(): Promise<PermissionItem[]> {
  try {
    const { data } = await api.get("/permissions");
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function getRolePermissionsAPI(roleId: number): Promise<PermissionItem[]> {
  try {
    const { data } = await api.get(`/role/${roleId}/permissions`);
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function updateRolePermissionsAPI(roleId: number, permissions: string[]): Promise<void> {
  try {
    await api.put(`/role/${roleId}/permissions`, { permissions });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
