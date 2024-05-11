import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWidget from "./PostWidget";
import axios from "axios";

import { Post } from "../types/contentTypes";
import { RootState } from "../state/store";
import { setPosts } from "../state/authSlice";

function PostsWidget() {
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.auth.posts);

    const getPosts = async () => {
        try {
            const postsUrl = `${import.meta.env.VITE_API_URL}/api/posts/`;
            const response = await axios.get(postsUrl, {
                timeout: 60000,
                withCredentials: true,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withXSRFToken: true,
                headers: {
                    Accept: "application/json",
                },
            });

            const posts_data: Post[] = await response.data;
            dispatch(setPosts({ posts: posts_data }));
        } catch {
            dispatch(setPosts({ posts: [] }));
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            {posts.map(post => <PostWidget key={post.id} post={post} />)}
        </>
    );
}

export default PostsWidget;