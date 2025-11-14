import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  phone: string;
  token: string;
}

const initialState: AuthState = {
  id: "",
  email: "",
  phone: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  // giá trị trạng thái ban đầu
  initialState: {
    authData: initialState,
  },
  // các hàm
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },
    removeAuth: (state, action) => {
      state.authData = initialState;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;
export const authSelecter = (state: any) => state.authReducer.authData;
