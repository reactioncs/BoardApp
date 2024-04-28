import { configureStore } from "@reduxjs/toolkit";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer, { toggleMode, setLogin, setLogout, setPosts, setPost, saveToLocalStorage } from "./authSlice";
import counterReducer from "./counterSlice";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    matcher: isAnyOf(toggleMode, setLogin, setLogout, setPosts, setPost),
    effect: (_, listenerApi) => {
        const state = (listenerApi.getState() as RootState).auth;
        saveToLocalStorage(state);
    },
});

export const store = configureStore({
    reducer: {
        auth: authReducer,
        counter: counterReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;