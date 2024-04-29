import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../state/store";
import Navbar from "../Scenes/Navbar";
import UserWidget from "../Scenes/UserWidget";
import MyPostWidget from "../Scenes/MyPostWidget";
import PostsWidget from "../Scenes/PostsWidget";
import AdvertWidget from "../Scenes/AdvertWidget";
import FriendsWidget from "../Scenes/FriendsWidget";

export function HomePage() {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user)
        return null;

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget user={user} />
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget />
                    <PostsWidget />
                </Box>

                {isNonMobileScreens && (
                    <Box flexBasis="26%">
                        <AdvertWidget />
                        <Box m="2rem 0" />
                        <FriendsWidget />
                    </Box>
                )}
            </Box>

            <Box>
                <Box display="flex">
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#dfeaf7" >#dfeaf7</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#bfd5f0" >#bfd5f0</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#9ec1e8" >#9ec1e8</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#7baddf" >#7baddf</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#539ad7" >#539ad7</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#0287cf" >#0287cf</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#176ba2" >#176ba2</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#1c4f77" >#1c4f77</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#19364e" >#19364e</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#131e29" >#131e29</Box>
                </Box>
                <Box display="flex">
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#FFFFFF" >#FFFFFF</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#F6F6F6" >#F6F6F6</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#F0F0F0" >#F0F0F0</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#E0E0E0" >#E0E0E0</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#C2C2C2" >#C2C2C2</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#A3A3A3" >#A3A3A3</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#858585" >#858585</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#666666" >#666666</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#4D4D4D" >#4D4D4D</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#333333" >#333333</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#1A1A1A" >#1A1A1A</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#0A0A0A" >#0A0A0A</Box>
                    <Box flexGrow="1" sx={{ height: 80 }} bgcolor="#000000" >#000000</Box>
                </Box>
            </Box>
        </Box>
    );
}