import { Security, Info } from "@mui/icons-material";
import { Grid, Typography, AppBar, Toolbar } from "@mui/material";
import Link from "next/link";
import React from "react";

const Footer = () => (
  <>
    <AppBar
      position="absolute"
      elevation={0}
      component="footer"
      color="default"
      sx={{ top: "auto", bottom: 0 }}
    >
      <Toolbar style={{ justifyContent: "right" }}>
        <Typography variant="caption">©2023 ISSArt, LLC</Typography>
      </Toolbar>
    </AppBar>
  </>
);

export default Footer;
