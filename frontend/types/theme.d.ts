import { PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        neutral?: PaletteColor;
    }

    interface PaletteColor {
        medium?: string;
    }

    interface TypeBackground {
        alt: string;
    }
}