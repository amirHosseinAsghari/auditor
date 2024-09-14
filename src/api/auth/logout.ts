import axiosInstance from "../axiosConfig";

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
