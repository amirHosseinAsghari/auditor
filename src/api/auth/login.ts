import axiosInstance from "../axiosConfig";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: "auditor" | "author";
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};
