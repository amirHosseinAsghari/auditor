import axiosInstance from "../axiosConfig";

interface Response {
    // TODO : field isAuthenticated?
  isAuthenticated: boolean;
}

export const isAuthenticated = async (): Promise<Response> => {
  const response = await axiosInstance.post<Response>("/auth/isAuthenticated");
  return response.data;
};
