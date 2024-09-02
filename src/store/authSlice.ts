import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  role: string | null;
  token: string | null;
  avatar: string | null;
}

const initialState: AuthState = {
  role: null,
  token: null,
  avatar: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{
        role: string;
        token: string;
        avatar: string;
      }>
    ) {
      const { role, token, avatar } = action.payload;
      state.role = role;
      state.token = token;
      state.avatar = avatar;
    },
    clearAuth(state) {
      state.role = null;
      state.token = null;
      state.avatar = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
