import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    DeleteOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../types/contentTypes";
import WidgetWrapper from "../components/WidgetWrapper";
import FriendBox from "../components/FriendBox";
import FlexBetween from "../components/FlexBetween";
import CommentBox from "../components/CommentBox";
import { RootState } from "../state/store";
import { setPosts } from "../state/authSlice";


function PostWidget({ post }: { post: Post }) {
    const [isComments, setIsComments] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const posts = useSelector((state: RootState) => state.auth.posts);
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const isLiked = true;
    const likeCount = 12;
    const main = palette.neutral?.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
    }

    const handlePostDelete = async () => {
        try {
            const postDeleteUrl = `${import.meta.env.VITE_API_URL}/api/posts/${post.id}`;
            await axios.delete(postDeleteUrl, {
                timeout: 60000,
                withCredentials: true,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withXSRFToken: true,
                headers: {
                    Accept: "application/json",
                },
            });
            
            dispatch(setPosts({ posts: posts.filter(p => p.id !== post.id) }));
        } finally {

        }
    }

    return (
        <WidgetWrapper m="2rem 0">
            <FriendBox
                id={"postUserId"}
                name={"Mike"}
                subtitle={"New york"}
                picPath={"/static/sample/2.jpg"}
            />
            <Box sx={{ position: "relative" }}>
                {isDeleting && (
                    <Box
                        width="100%" height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ position: "absolute" }}
                    >
                        <Box display="flex" flexDirection="column" gap="8px" width="100px">
                            <Button
                                onClick={handlePostDelete}
                                sx={{
                                    color: "white",
                                    backgroundColor: "red",
                                    borderRadius: "3rem",
                                }}
                            >
                                DELETE
                            </Button>
                            <Button
                                onClick={() => setIsDeleting(false)}
                                sx={{
                                    color: "white",
                                    backgroundColor: "blue",
                                    borderRadius: "3rem",
                                }}
                            >
                                CANCEL
                            </Button>
                        </Box>
                    </Box>
                )}

                <Typography color={main} sx={{ mt: "1rem" }}>
                    {post.content}
                </Typography>
                {post.picture && (
                    <img
                        width="100%"
                        height="auto"
                        alt="post"
                        style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                        src={`${import.meta.env.VITE_API_URL}${post.picture}`}
                    />
                )}
            </Box>

            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{post.comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>

                <Box>
                    {!isDeleting && (
                        <IconButton onClick={() => setIsDeleting(true)}>
                            <DeleteOutlined />
                        </IconButton>
                    )}
                    <IconButton>
                        <ShareOutlined />
                    </IconButton>
                </Box>
            </FlexBetween>
            {isComments && (
                <Box mt="0.5rem">
                    {post.comments.map(comment => <CommentBox post_id={post.id} comment_id={comment} />)}
                    <Divider />
                </Box>
            )}
        </WidgetWrapper>
    );
}

export default PostWidget;