import { FC, ReactNode } from "react";
import { Box, CssBaseline, Grid, useMediaQuery, useTheme } from "@mui/material";

import NavBar from "../NavBar";
import Footer from "../Footer";

const Layout: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      <CssBaseline />
      <Box
        id="page-container"
        sx={{ position: "relative", minHeight: "100vh" }}
      >
        <Box id="content-wrapper" sx={{ paddingBottom: "64px" }}>
          <NavBar />
          <Grid
            sx={{ pt: isMobile ? 12 : 10 }}
            justifyContent="center"
            container
            spacing={isMobile ? 2 : 0}
          >
            <Grid item lg={8} xs={10}>
              {children}
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
