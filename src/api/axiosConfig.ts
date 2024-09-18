import {showErrorToast} from "@/utils/toast";
import axios from "axios";
import {toast} from "sonner";

let toastId: any = null;
const axiosInstance = axios.create({
    // TODO
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            // TODO set custom header
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (config) => {
        if (config.method === "post" || config.method === "patch" || config.method === "put" || config.method === "delete"){
            toastId = toast.loading("Loading")
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
