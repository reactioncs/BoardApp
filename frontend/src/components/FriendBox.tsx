import { useTheme } from "@mui/material/styles";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";

import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

interface FriendBoxProp {
    id: string;
    name: string;
    subtitle: string;
    picPath: string;
}

function FriendBox({ id, name, subtitle, picPath }: FriendBoxProp) {
    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral?.main;
    const medium = palette.neutral?.medium;

    const isFriend = false;

    const patchFriend = async () => {
    }

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={picPath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${id}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            <IconButton
                onClick={() => patchFriend()}
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
                {isFriend ? (
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                )}
            </IconButton>
        </FlexBetween>
    );
}

export default FriendBox;