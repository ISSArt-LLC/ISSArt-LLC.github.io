import { FC, ReactNode } from 'react';
import { CssBaseline, Grid, useMediaQuery, useTheme } from '@mui/material';

import NavBar from '../NavBar';
import Footer from '../Footer';

const Layout: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Grid
        sx={{ pt: isMobile ? 12 : 10 }}
        justifyContent='center'
        container
        spacing={isMobile ? 2 : 0}
      >
        <Grid item lg={8} xs={10}>
          {children}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Layout;
