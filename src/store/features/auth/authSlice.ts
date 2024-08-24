import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {login as loginApi , isAuthenticated as isAuthenticatedApi, logout as logoutApi} from "@/store/services/auth.ts";
import {RootState} from "@/store/store.ts";

export enum userType{
    AUTHOR = "author",
    AUDITOR = "auditor"
}
export interface AuthState {
    username: string | null,
    usertype: userType | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
}
interface loginResponse {
    username: string;
    token: string;
}
type isAuthenticatedResponse = loginResponse
interface credentials{
    username: string,
    password: string,
}

const initialState: AuthState = {
    username: null,
    usertype: userType.AUTHOR,
    token: JSON.stringify(localStorage.getItem('token')) || null,
    isAuthenticated: true,
    loading: false,
} satisfies AuthState as AuthState;

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: credentials, thunkAPI) => {
        try {
            const response =  await loginApi(credentials);
            if (response.data){
                return response.data();
            }
        }catch (error){
            if(error instanceof Error){
                return thunkAPI.rejectWithValue(error)
            }
        }
    }
)
export const isAuthenticated = createAsyncThunk(
    "auth/isAuthenticated",
    async (token: string, thunkAPI) => {
        try {
            const response = await isAuthenticatedApi(token);
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
export const logout = createAsyncThunk(
    "auth/logout",
    async (token: string, thunkAPI) => {
        try {
            const response = await logoutApi(token);
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


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        // login reducers
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(login.fulfilled, (state, action: PayloadAction<loginResponse>) => {
            state.username = action.payload.username;
            state.token = action.payload.token;
            localStorage.setItem("token", JSON.stringify(state.token))
            state.isAuthenticated = true;
            state.loading = false;
        })
        builder.addCase(login.rejected, (state) => {
            state.loading = false;
        })
        // isAuthenticated reducers
        builder.addCase(isAuthenticated.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(isAuthenticated.fulfilled, (state, action: PayloadAction<isAuthenticatedResponse>) => {
            state.username = action.payload.username;
            state.token = action.payload.token;
            localStorage.setItem("token", JSON.stringify(state.token))
            state.isAuthenticated = true;
            state.loading = false;
        })
        builder.addCase(isAuthenticated.rejected, (state) => {
            state.loading = false;
        })
        // logout reducers
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.username = null;
            state.token = null;
            localStorage.removeItem("token");
            state.isAuthenticated = false;
            state.loading = false;
        })
    }


})
// selectors
export const selectAuthState = (state: RootState) => state.auth;


export default authSlice.reducer;