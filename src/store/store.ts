import {configureStore} from '@reduxjs/toolkit';
import {authSlice} from "@/store/features/auth/authSlice.ts";
import {reportsSlice} from "@/store/features/reports/reportsSlice.ts";

export const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        reports: reportsSlice.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;