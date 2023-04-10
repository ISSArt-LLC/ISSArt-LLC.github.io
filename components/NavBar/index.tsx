import { FC, useState, MouseEvent, KeyboardEvent } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  SwipeableDrawer,
} from "@mui/material";
import Image from "next/image";
// import MenuIcon from '@mui/icons-material/Menu';

// import LanguageSwitchMenu from '../LanguageSwitchMenu';
// import ProjectSearchInput from '../ProjectSearchInput';
import HeaderLinksList from "../HeaderLinkList";

const NavBar: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "start" }}>
        {!isMobile ? (
          <>
            <Image
              width={150}
              height={37}
              src="/assets/icons/CompanyLogo.svg"
              alt="ISS Art company logo"
              style={{ marginRight: 50 }}
            />
            <Box>{<HeaderLinksList local />}</Box>
          </>
        ) : (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              PaperProps={{
                sx: { backgroundColor: theme.palette.primary.main, p: 2 },
              }}
            >
              <Image
                width={150}
                height={37}
                src="/assets/icons/CompanyLogo.svg"
                alt="ISS Art company logo"
                style={{ marginBottom: "16px" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {/* <HeaderLinksList local mobile /> */}
              </Box>
            </SwipeableDrawer>
          </>
        )}
        <Box alignItems="center">
          {/* <ProjectSearchInput /> */}
          {/* <LanguageSwitchMenu /> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
