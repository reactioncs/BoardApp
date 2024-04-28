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
        // setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
        //     state.posts = action.payload.posts;
        // },
        // setPost: (state, action) => {
        //     const updatedPosts = state.posts.map(post => {
        //         if (post.id === action.payload.post_id)
        //             return action.payload.post;
        //         else
        //             return post;
        //     });
        //     state.posts = updatedPosts;
        // },
    }
});

export const { toggleMode } = preferenceSlice.actions;
export default preferenceSlice.reducer;