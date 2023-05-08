import React from "react";
import { Avatar, Stack } from "@mui/material";
import moment from "moment";

import "../../assets/chats.css";
import { useGlobalChatContext } from "../../store/chatContext";
import useUnreadNotifications from "../../hooks/useUnreadNotifications";
import useFetchLatestMessage from "../../hooks/useFetchLatestMessage";
import useFetchReceiverUser from "../../hooks/useFetchReceiverUser";
import { useNavigate } from "react-router-dom";

const UserChatsContainer = ({ chat, user }) => {
  const navigate = useNavigate();

  const { receivedUser } = useFetchReceiverUser(chat, user);
  const { notifications, markNotificationAsRead } = useGlobalChatContext();

  const unreadNotifications = useUnreadNotifications(notifications);

  const { latestMessage } = useFetchLatestMessage(chat);

  const currentUserNotifications = unreadNotifications?.filter(
    (notif) => notif?.senderId === receivedUser?._id
  );

  const truncateText = (text) => {
    let shortText = text?.substring(0, 20);
    if (text?.length > 20) {
      shortText = shortText + "...";
    }
    return shortText;
  };
  const handleNotifications = () => {
    if (currentUserNotifications?.length !== 0) {
      markNotificationAsRead(currentUserNotifications, notifications);
    }
  };

  return (
    <Stack
      direction={"row"}
      spacing={3}
      className="user-card"
      onClick={() => handleNotifications()}
    >
      <div className="flex">
        <div>
          <Avatar sx={{ marginRight: 1.5 }}>
            <img src={receivedUser?.avatar} alt="avatar" />
          </Avatar>
        </div>
        <div className="text-content">
          <div className="name">{receivedUser?.name}</div>
          <div className="text">
            <span>{truncateText(latestMessage?.text) ?? ""}</span>
          </div>
        </div>
      </div>
      <div className="date-container">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            currentUserNotifications?.length > 0 ? "user-notifications" : ""
          }
        >
          {currentUserNotifications?.length > 0
            ? currentUserNotifications?.length
            : ""}
        </div>
      </div>
    </Stack>
  );
};

export default UserChatsContainer;
