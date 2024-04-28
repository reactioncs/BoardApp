import { useState } from "react";
import { Box, FormControl, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import { DarkMode, Help, LightMode, Message, Notifications, Search, Menu, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toggleMode, setLogout } from "../state/authSlice";
import { RootState } from "../state/store";
import FlexBetween from "./FlexBetween";

function Navbar() {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const user = useSelector((state: RootState) => state.auth.user);
    const mode = useSelector((state: RootState) => state.auth.mode);

    const fullName = user === null ? "No User" : `${user.firstName} ${user.lastName}`;

    const handleLogout = async () => {
        if (user === null)
            return;

        const logoutUrl = `${import.meta.env.VITE_API_URL}/api/user/logout/`;
        await axios.post(logoutUrl, null, {
            timeout: 60000,
            withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            withXSRFToken: true,
            headers: {
                Accept: "application/json",
            },
        });
        dispatch(setLogout());
    }

    return (
        <FlexBetween padding="1rem 6%" bgcolor="background.alt">
            <Typography
                fontWeight="bold"
                fontSize="clamp(1rem, 2rem, 2.25rem)"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{
                    "&:hover": {
                        color: "primary.light",
                        cursor: "pointer",
                    },
                }}
            >
                Sociopedia
            </Typography>
            {isNonMobileScreens && (
                <FlexBetween
                    bgcolor="neutral.light"
                    borderRadius="9px"
                    gap="3rem"
                    padding="0.1rem 1.5rem">
                    <InputBase placeholder="Search..." />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween >
            )}

            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(toggleMode())}>
                        {mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightMode sx={{ color: "neutral.dark", fontSize: "25px" }} />
                        )}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant="standard">
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: "neutral.light",
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem",
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: "neutral.light",
                                },
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu />
                </IconButton>
            )}

            {/* MOBILE NAV */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    bgcolor="background.default"
                >
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* MENU ITEMS */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    >
                        <IconButton
                            onClick={() => dispatch(toggleMode())}
                            sx={{ fontSize: "25px" }}
                        >
                            {mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: "neutral.dark", fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <Message sx={{ fontSize: "25px" }} />
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />
                        <FormControl variant="standard">
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: "neutral.light",
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: "neutral.light",
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween >
    );
}

export default Navbar;