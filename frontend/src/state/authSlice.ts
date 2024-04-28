import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/reduxState";
import { User } from "../types/authTypes";

const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
        },
        setLogout: state => {
            state.user = null;
        },
    }
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;