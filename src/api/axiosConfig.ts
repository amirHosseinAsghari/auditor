import { showErrorToast } from "@/utils/toast";
import axios from "axios";
import { store } from "@/store/store";
import { clearAuth } from "@/store/authSlice";

const axiosInstance = axios.create({
  // TODO
  baseURL: "https://api.idontknow.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        store.dispatch(clearAuth());
        localStorage.clear();

        window.location.href = "/login";
      } else {
        showErrorToast(data.message || "An error occurred");
      }
    } else {
      showErrorToast("Network error");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
