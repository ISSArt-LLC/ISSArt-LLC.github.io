import React from "react";
import AnimatedLogo from "../components/AnimatedLogo";
import Container from "@mui/material/Container";
import { Box, Button, Stack } from "@mui/material";

export default function Home() {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
      >
        <Stack spacing={8}>
          <AnimatedLogo />
          <Button href={`/blog`} variant="outlined">Explore</Button>
        </Stack>
      </Box>
    </>
  );
}
