import React, { useState } from "react";
import { useGlobalChatContext } from "../../store/chatContext";
import { Container, Hidden, Stack } from "@mui/material";
import UserChat from "../../components/chats/UserChat";
import { useGlobalContext } from "../../store/authContext";
import homeStyles from "../../assets/homeStyles";
import PotentialChats from "../../components/chats/PotentialChats";
import ChatBox from "../../components/chats/ChatBox";
import Dialog from "../../components/Dialog/Dialog";

const HomePage = () => {
  const { userChats, isChatLoading, updateCurrentChat } =
    useGlobalChatContext();
  const { user } = useGlobalContext();

  const [open, setOpen] = useState(false);
  // if (userChats?.length < 1) {
  //   return;
  // }
  return (
    <Container>
      <PotentialChats />
      <Stack direction={"row"} spacing={4} sx={homeStyles.containerHeight}>
        <Stack spacing={3}>
          {isChatLoading && <p>Loading...</p>}
          {userChats?.map((chat, index) => (
            <div
              key={chat._id + index}
              onClick={() => {
                updateCurrentChat(chat);
                setOpen(true);
              }}
            >
              <UserChat chat={chat} user={user} />
            </div>
          ))}
        </Stack>
        <Hidden smDown>
          <ChatBox />
        </Hidden>
        <Hidden smUp>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <ChatBox />
          </Dialog>
        </Hidden>
      </Stack>
    </Container>
  );
};

export default HomePage;
