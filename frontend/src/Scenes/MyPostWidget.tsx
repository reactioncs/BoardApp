import { useTheme } from "@mui/material/styles";
import { Box, Button, Divider, IconButton, InputBase, Typography, useMediaQuery } from "@mui/material";
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";

import { RootState } from "../state/store";
import { Post, UploadedImage } from "../types/contentTypes";
import WidgetWrapper from "../components/WidgetWrapper";
import FlexBetween from "../components/FlexBetween";
import UserImage from "../components/UserImage";
import { setPosts } from "../state/authSlice";
import Dropzone from "../components/Dropzone";

function MyPostWidget() {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const [postInput, setPostInput] = useState("");
    const [imageToUpload, setImageToUpload] = useState<File | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const posts = useSelector((state: RootState) => state.auth.posts);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral?.mediumMain;
    const medium = palette.neutral?.medium;

    if (!user)
        return null;

    const handlePost = async () => {
        try {
            let uploadedImage: UploadedImage | null = null;

            if (imageToUpload) {
                const formData = new FormData();
                formData.append("title", imageToUpload.name)
                formData.append("file", imageToUpload)

                const uploadUrl = `${import.meta.env.VITE_API_URL}/api/bucket/upload/`;
                const response = await axios.post(uploadUrl, formData, {
                    timeout: 60000,
                    withCredentials: true,
                    xsrfCookieName: 'csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    withXSRFToken: true,
                    headers: {
                        Accept: "application/json",
                    },
                });

                uploadedImage = await response.data;
            }

            const postUrl = `${import.meta.env.VITE_API_URL}/api/posts/`;
            const response = await axios.post(postUrl, {
                content: postInput,
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
            
            let uploadedPost: Post = await response.data;

            if (uploadedImage) {
                const setPictureUrl = `${import.meta.env.VITE_API_URL}/api/posts/${uploadedPost.id}/setPicture/`;
                const response = await axios.post(setPictureUrl, {
                    pictureId: uploadedImage.id,
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
                uploadedPost = await response.data;
            }

            dispatch(setPosts({ posts: [uploadedPost, ...posts] }));
        } finally {
            setPostInput("");
            setImageToUpload(null);
        }
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={"/static/sample/1.jpg"} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPostInput(e.target.value)}
                    value={postInput}
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
                        border={`1px solid ${palette.primary.light}`}
                        p="1rem"
                        width="100%"
                    >
                        <FlexBetween>
                            <Dropzone image={imageToUpload} setImage={setImageToUpload} />
                            <EditOutlined />
                        </FlexBetween>
                    </Box>
                    <FlexBetween
                        flexDirection="row-reverse"
                        justifyContent="flex-start"
                        sx={{ width: "15%" }}
                    >
                        <IconButton onClick={() => setImageToUpload(null)}>
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
                    disabled={!postInput}
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

export default MyPostWidget;