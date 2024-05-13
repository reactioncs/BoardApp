import { Box, Typography } from "@mui/material";
import { useRef } from "react";

interface DropzoneProp {
    size?: number,
    image: File | null,
    setImage: (file: File | null) => void,
}

function Dropzone({ size = 80, image, setImage }: DropzoneProp) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
        e.preventDefault();
        updateImageToUpload(e.dataTransfer.files);
    }

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const files = e.target.files;
        files && updateImageToUpload(files);
    }

    const updateImageToUpload = (files: FileList) => {
        if (files.length >= 1) {
            const file = files[0];
            if (file.type.match("image")) {
                setImage(file);
            }
        }
    }

    return (
        <Box
            height="100%" width="100%"
            sx={{ cursor: "pointer" }}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file" className="file" accept="image/*" ref={inputRef} hidden
                onChange={onFileInputChange}
            />
            {image ? (
                <img
                    style={{ objectFit: "cover" }}
                    height={size} width={size}
                    src={URL.createObjectURL(image)}
                />
            ) : (
                <Typography>Add Image Here</Typography>
            )}
        </Box>
    );
}

export default Dropzone;