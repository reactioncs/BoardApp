import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 42,
}

export const authSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<{ value: number }>) => {
            state.value += action.payload.value;
        },
        decrement: (state, action: PayloadAction<{ value: number }>) => {
            state.value += action.payload.value;
        },
    },
});

export const { increment, decrement } = authSlice.actions;
export default authSlice.reducer;