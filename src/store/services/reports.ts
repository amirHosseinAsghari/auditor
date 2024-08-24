import axios from "axios";

const API_URL = "/api/reports";


const authState = {
    token: "fsf"
}
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
    params:{
        'token': authState.token,
    }
};

export const getReports = async (page: number) => {
    try {
        const response = await axios.get(API_URL + "?page=" + page, config)
        if (response.data){
            return response.data;
        }
    }catch (error){
        if (error instanceof Error){
            return error;
        }
    }
}