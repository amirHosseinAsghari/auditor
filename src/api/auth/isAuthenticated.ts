import axiosInstance from "../axiosConfig";

export interface isAuthenticatedResponse {
    token: string;
    role: string;
    isAuthenticated: boolean;
}

export const isAuthenticated = async (): Promise<isAuthenticatedResponse> => {
    const response = await axiosInstance.post<isAuthenticatedResponse>("/auth/isAuthenticated");
    return response.data;
};
