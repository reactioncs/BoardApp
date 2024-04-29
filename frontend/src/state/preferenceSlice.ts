import { createSlice } from "@reduxjs/toolkit";
import { PreferenceState } from "../types/reduxState";

function loadFromLocalStorage(): PreferenceState {
    const authState = localStorage.getItem("preference");
    if (authState === null)
        return {
            mode: "light",
        };
    return JSON.parse(authState);
}

export function saveToLocalStorage(state: PreferenceState) {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("preference", serialisedState);
}

export const preferenceSlice = createSlice({
    name: "preference",
    initialState: loadFromLocalStorage(),
    reducers: {
        toggleMode: state => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
    }
});

export const { toggleMode } = preferenceSlice.actions;
export default preferenceSlice.reducer;