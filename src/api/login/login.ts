import axiosInstance from "../axiosConfig";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  avatar: string;
  role: "auditor" | "author";
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/login",
    credentials
  );
  return response.data;
};
