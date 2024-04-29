import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Post } from "../types/contentTypes";
import WidgetWrapper from "../components/WidgetWrapper";
import FriendBox from "../components/FriendBox";
import FlexBetween from "../components/FlexBetween";
import CommentBox from "../components/CommentBox";

function PostWidget({ post }: { post: Post }) {
    const [isComments, setIsComments] = useState(false);
    const { palette } = useTheme();
    const isLiked = true;
    const likeCount = 12;
    const main = palette.neutral?.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
    }

    return (
        <WidgetWrapper m="2rem 0">
            <FriendBox
                id={"postUserId"}
                name={"Mike"}
                subtitle={"New york"}
                picPath={"/static/sample/2.jpg"}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {post.content}
            </Typography>
            <img
                width="100%"
                height="auto"
                alt="post"
                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                src={"/static/sample/4.jpg"}
            />

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

                <IconButton>
                    <ShareOutlined />
                </IconButton>
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