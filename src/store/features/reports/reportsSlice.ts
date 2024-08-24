import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {RootState} from "@/store/store.ts";
import {getReports as getReportsApi} from "@/store/services/reports.ts";

enum cvss_vector {
    LOW,
    MEDIUM,
    HIGH

}
export interface Report {
    id: number;
    author: string;
    auditor?: string;
    date: string;
    title: string;
    vulnerability_path: string;
    description: string;
    source?: string;
    cvss_vector?: cvss_vector;
    documents?: string;
}
interface ReportsState {
    page:number;
    pageSize:number | undefined;
    loading: boolean;
    reports:Report[];
}
const initialState: ReportsState = {
    page: 1,
    pageSize: 10,
    loading: false,
    reports: [
        {
            id: 1,
            author: "Alexander",
            auditor: "Alexander",
            date: "2020-06-07",
            title: "Alexander",
            vulnerability_path: "Alexander",
            description: "Alexander"
        }
    ]
};

export const getReports = createAsyncThunk(
    "auth/getReports",
    async (page: number, thunkAPI) => {
        try {
            const response = await getReportsApi(page);
            if (response.data){
                return response.data;
            }
        }catch (error){
            if(error instanceof Error){
                return thunkAPI.rejectWithValue(error);
            }
        }
    }
)

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getReports.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
            state.loading = false;
            state.reports = action.payload;

        })
    }
})

export const selectReports = (state: RootState) => state.reports;

export default reportsSlice.reducer;