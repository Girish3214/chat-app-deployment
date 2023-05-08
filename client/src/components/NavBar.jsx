import { Avatar, Box, Container, Typography } from "@mui/material";
import React from "react";
import headerStyles from "../assets/headerStyles";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../store/authContext";
import Hidden from "@mui/material/Hidden";
import { useGlobalChatContext } from "../store/chatContext";

const NavBar = () => {
  const { user, logoutUser } = useGlobalContext();
  const { deleteCurrentChat } = useGlobalChatContext();
  const { pathname } = useLocation();

  const logoutHandler = () => {
    logoutUser();
    deleteCurrentChat();
  };
  return (
    <>
      <Box sx={headerStyles.box}>
        <Container maxWidth="auto" sx={headerStyles.container}>
          <Container maxWidth="lg" sx={headerStyles.centerContainer}>
            <Typography
              variant="h4"
              sx={(theme) => ({
                "& > a": {
                  textDecoration: "none",
                  color: "inherit",
                },
                [theme.breakpoints.down("md")]: {
                  fontSize: "2rem",
                },
              })}
            >
              <Link to={"/"}>ChatApp</Link>
            </Typography>
            {user && (
              <Box sx={headerStyles.menuContainer}>
                {user?.avatar && (
                  <Avatar sx={headerStyles.avatar}>
                    <img src={user?.avatar} alt="profile" />
                  </Avatar>
                )}
                <Hidden mdDown>
                  <Typography variant="h6" sx={headerStyles.menuTitles}>
                    {user?.name}
                  </Typography>
                </Hidden>
              </Box>
            )}
            <Box sx={headerStyles.menuContainer}>
              {user ? (
                <>
                  <Typography variant="h6" sx={headerStyles.menuTitles}>
                    <Link to={"/login"} onClick={() => logoutHandler()}>
                      Logout
                    </Link>
                  </Typography>
                </>
              ) : (
                <>
                  {pathname === "/register" && (
                    <Typography variant="h6" sx={headerStyles.menuTitles}>
                      <Link to={"/login"}>Login</Link>
                    </Typography>
                  )}
                  {pathname === "/login" && (
                    <Typography variant="h6" sx={headerStyles.menuTitles}>
                      <Link to={"/register"}>Register</Link>
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Container>
        </Container>
      </Box>
    </>
  );
};

export default NavBar;
