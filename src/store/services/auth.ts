import axios from "axios";

const API_URL = "/api/auth";
interface credentials {
    username: string;
    password: string;
}
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export const login = async (credentials: credentials) => {
    try {
        const response = await axios.post(API_URL + "/login", credentials,config);
        if (response.data){
            localStorage.setItem("session", response.data.session);
            return response.data;
        }
    }catch (error){
        if (error instanceof Error){
            return error;
        }
    }
}

export const isAuthenticated = async (token: string) =>  {
    try {
        const response = await axios.post(API_URL + "/isAuthenticated", token);
        if (response.data){
            return response.data;
        }
    }catch (error){
        if (error instanceof Error){
            return error;
        }
    }
}

export const logout = async (token: string) => {
    try {
        const response = await axios.post(API_URL + "/logout", token);
        if (response.data){
            return response.data;
        }
    }catch (error){
        if (error instanceof Error){
            return error;
        }
    }
}

