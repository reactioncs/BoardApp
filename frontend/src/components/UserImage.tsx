import { Box } from "@mui/material";

function UserImage({ image, size = "60px" }: { image: string, size?: string }) {
    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width={size} height={size}
                alt="user"
                src={image}
            />
        </Box>
    );
}

export default UserImage;