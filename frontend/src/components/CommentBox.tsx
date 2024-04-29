import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import { Comment } from "../types/contentTypes";

function CommentBox({ post_id, comment_id }: { post_id: string, comment_id: string }) {
    const [comment, setComment] = useState<Comment | null>(null);

    const getComment = async () => {
        try {
            const postsUrl = `${import.meta.env.VITE_API_URL}/api/posts/${post_id}/comments/${comment_id}`;
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

            const comment_data: Comment = await response.data;
            setComment(comment_data);
        } catch {
            console.log(`Failed to get comment: ${comment_id}`);
        }
    }

    useEffect(() => {
        getComment();
    }, []);

    return (
        <Box key={comment_id}>
            <Divider />
            <Typography sx={{ color: "neutral.main", m: "0.5rem 0", pl: "1rem" }}>
                {comment?.content}
            </Typography>
        </Box>
    );
}

export default CommentBox;