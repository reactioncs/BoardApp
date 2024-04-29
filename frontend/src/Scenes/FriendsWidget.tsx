import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Friend } from "../types/contentTypes";
import WidgetWrapper from "../components/WidgetWrapper";
import { Box, Typography } from "@mui/material";
import FriendBox from "../components/FriendBox";

function FriendsWidget() {
    // const dispatch = useDispatch();
    const { palette } = useTheme();
    const [friends, setFriends] = useState<Friend[]>([]);

    const getFriends = () => {
        setFriends([{
            id: "f1",
            username: "alice",
            firstName: "Alice",
            lastName: "Mike",
        },
        {
            id: "f2",
            username: "bob",
            firstName: "Bob",
            lastName: "Mike",
        },
        {
            id: "f3",
            username: "tom",
            firstName: "Tom",
            lastName: "Mike",
        }]);
    }

    useEffect(() => {
        getFriends();
    }, []);

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral?.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.map(friend => (
                    <FriendBox
                        key={friend.id}
                        id={friend.id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle="department manager"
                        picPath={"/static/sample/1.jpg"}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );
}

export default FriendsWidget;