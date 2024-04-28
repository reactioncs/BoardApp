import { useTheme } from "@mui/material/styles";
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Box, Button, Divider, IconButton, InputBase, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";

import { RootState } from "../state/store";
import { Post } from "../types/contentTypes";
import WidgetWrapper from "../components/WidgetWrapper";
import FlexBetween from "../components/FlexBetween";
import UserImage from "../components/UserImage";

function UserWidget() {
    // const [isImage, setIsImage] = useState(false);
    // const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral?.mediumMain;
    const medium = palette.neutral?.medium;

    if (!user)
        return null;

    const handlePost = async () => {
        const postUrl = `${import.meta.env.VITE_API_URL}/api/post/`;
        const response = await axios.post(postUrl, {
            content: post
        }, {
            timeout: 60000,
            withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            withXSRFToken: true,
            headers: {
                Accept: "application/json",
            },
        });

        const uploadedPost: Post = await response.data;
        console.log(uploadedPost);
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={"/static/sample/1.jpg"} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral?.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>


            <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
            >
                <FlexBetween>
                    <Box
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                        <FlexBetween>
                            <Typography>Add Image Here</Typography>
                            <EditOutlined />
                        </FlexBetween>
                    </Box>
                    <FlexBetween
                        flexDirection="row-reverse"
                        justifyContent="flex-start"
                        sx={{ width: "15%" }}
                    >
                        <IconButton onClick={() => { }}>
                            <DeleteOutlined />
                        </IconButton>
                    </FlexBetween>

                </FlexBetween>
            </Box>

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => { }}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
        </WidgetWrapper >
    );
}

export default UserWidget;