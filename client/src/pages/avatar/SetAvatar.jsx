import React, { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import axios from "../../uitils/baseAxios";
import { Buffer } from "buffer";
import { avatarSeeds, bgColors, sprites } from "../../uitils/avatarName";
import { setAvatarApi } from "../../uitils/apiUrls";
import AlertMsg from "../../components/AlertMsg";
import { useGlobalContext } from "../../store/authContext";

const SetAvatar = () => {
  const { setAvatarUser } = useGlobalContext();
  const avatarApi = "https://avatars.dicebear.com/api";
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [avatarError, setAvatarError] = useState(false);
  const getAvatars = async () => {
    let data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${avatarApi}/${sprites[Math.floor(Math.random() * 8) + 1]}/${
          avatarSeeds[Math.floor(Math.random() * 19) + 1]
        }.svg`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
  };

  const getInitialAvatar = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      const image = await axios.get(
        `https://api.dicebear.com/6.x/initials/svg?seed=${
          user.name
        }&backgroundColor=${bgColors[Math.floor(Math.random() * 14) + 1]}`
      );
      const buffer = new Buffer(image.data);
      setSelectedAvatar(buffer.toString("base64"));
    }
  };
  const setProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoading(true);
    if (user?._id) {
      const avatar = await axios.post(`${setAvatarApi}/${user._id}`, {
        avatar: `data:image/svg+xml;base64,${selectedAvatar}`,
      });

      setIsLoading(false);
      if (avatar.statusText === "OK") {
        localStorage.removeItem("user");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: avatar.data.avatar })
        );
        setAvatarUser({ ...user, avatar: avatar.data.avatar });
        navigate("/");
      } else {
        setAvatarError(true);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getAvatars();
    return () => {};
  }, [refresh]);

  useEffect(() => {
    getInitialAvatar();
    return () => {};
  }, []);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {avatarError && (
        <AlertMsg
          open={avatarError}
          message={"Error in updating Avatar.Please try later!"}
          handleClose={() => setAvatarError(false)}
        />
      )}
      <Container component="main" maxWidth="sm" sx={{ paddingTop: "4rem" }}>
        <Paper
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
          elevation={5}
        >
          <Avatar
            sx={{
              bgcolor: "transparent",
              color: "white",
              width: 56,
              height: 56,
              margin: 1,
            }}
          >
            {selectedAvatar && (
              <img
                src={`data:image/svg+xml;base64,${selectedAvatar}`}
                alt="avatar"
                sx={{ width: 56, height: 56 }}
              />
            )}
          </Avatar>
          <Typography component="h1" variant="h5">
            Select Avatar
          </Typography>

          <Box component="main" noValidate sx={{ mt: 1 }} className="avatars">
            {isLoading ? (
              <CircularProgress color="inherit" sx={{ height: "5rem" }} />
            ) : (
              avatars.map((avatar, index) => (
                <div
                  key={avatar + index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                </div>
              ))
            )}
          </Box>
          <Button onClick={() => setRefresh(refresh + 1)}>
            refresh avatars
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => setProfile()}
          >
            set avatar
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default SetAvatar;
