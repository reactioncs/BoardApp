import { configureStore } from "@reduxjs/toolkit";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import preferenceReducer, { toggleMode, saveToLocalStorage } from "./preferenceSlice";
import counterReducer from "./counterSlice";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    matcher: isAnyOf(toggleMode),
    effect: (_, listenerApi) => {
        const state = (listenerApi.getState() as RootState).preference;
        saveToLocalStorage(state);
    },
});

export const store = configureStore({
    reducer: {
        auth: authReducer,
        preference: preferenceReducer,
        counter: counterReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;