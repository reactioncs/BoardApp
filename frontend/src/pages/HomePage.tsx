import { Box } from "@mui/material";

import Navbar from "../components/Navbar";

export function HomePage() {
    return (
        <Box>
            <Navbar />
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