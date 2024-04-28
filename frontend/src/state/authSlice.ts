import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/reduxState";
import { User } from "../types/authTypes";
import { Post } from "../types/contentTypes";

function loadFromLocalStorage(): AuthState {
    const authState = localStorage.getItem("auth");
    if (authState === null)
        return {
            mode: "light",
            user: null,
            posts: [],
        };
    return JSON.parse(authState);
}

export function saveToLocalStorage(state: AuthState) {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("auth", serialisedState);
}

export const authSlice = createSlice({
    name: "auth",
    initialState: loadFromLocalStorage(),
    reducers: {
        toggleMode: state => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user;
        },
        setLogout: state => {
            state.user = null;
        },
        setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map(post => {
                if (post.id === action.payload.post_id)
                    return action.payload.post;
                else
                    return post;
            });
            state.posts = updatedPosts;
        },
    }
});

export const { toggleMode, setLogin, setLogout, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;