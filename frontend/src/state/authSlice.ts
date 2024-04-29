import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types/reduxState";
import { User } from "../types/authTypes";
import { Post } from "../types/contentTypes";

const initialState: AuthState = {
    user: null,
    posts: [],
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
        setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action: PayloadAction<{ post: Post }>) => {
            const updatedPosts = state.posts.map(post => {
                if (post.id === action.payload.post.id)
                    return action.payload.post;
                else
                    return post;
            });
            state.posts = updatedPosts;
        },
    }
});

export const { setLogin, setLogout, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;