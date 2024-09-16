import axiosInstance from "../axiosConfig";

interface Response {
    token: string;
    role: boolean;
}

export const isAuthenticated = async (): Promise<Response> => {
    const response = await axiosInstance.post<Response>("/auth/isAuthenticated");
    return response.data;
};
