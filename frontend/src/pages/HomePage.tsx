import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../state/store";
import Navbar from "../components/Navbar";
import UserWidget from "../components/UserWidget";

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

                </Box>
            </Box>

            <Box sx={{ width: 200, height: 80 }} bgcolor="#dfeaf7" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#bfd5f0" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#9ec1e8" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#7baddf" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#539ad7" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#0287cf" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#176ba2" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#1c4f77" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#19364e" />
            <Box sx={{ width: 200, height: 80 }} bgcolor="#131e29" />
        </Box>
    );
}