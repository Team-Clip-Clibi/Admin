import { callApi } from "@/utils/api";
import API_ENDPOINTS from "@/config/apiEndpoints";
import { LoginRequest } from "./authType";

export const login = async (loginData: LoginRequest): Promise<Response> => {
    return callApi(API_ENDPOINTS.AUTH.LOGIN, "POST", loginData, { 
      isFormData: true 
    });
  };

export const logout = async () => {
    const res = await callApi(API_ENDPOINTS.AUTH.LOGOUT, "POST");
    return res;
}

export const getCsrfToken = async () => {
    const res = await callApi(API_ENDPOINTS.AUTH.LOGIN, "GET");
    return res;
}