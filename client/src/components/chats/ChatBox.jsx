import React, { useEffect, useRef, useState } from "react";
import { Avatar, Hidden, IconButton, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Lottie from "react-lottie-player";

import { useGlobalChatContext } from "../../store/chatContext";
import { useGlobalContext } from "../../store/authContext";
import useFetchReceiverUser from "../../hooks/useFetchReceiverUser";
import Animation from "../../uitils/typingAnimation.json";
import "../../assets/chats.css";

const ChatBox = () => {
  const { user } = useGlobalContext();
  const {
    currentChat,
    messages,
    socket,
    isMessageLoading,
    sendTextMessage,
    onlineUser,
    deleteNotifications,
  } = useGlobalChatContext();

  const { receivedUser } = useFetchReceiverUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef();

  const isOnline = onlineUser.some((user) => user.userId === receivedUser?._id);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    return () => {};
  }, [typing, socket]);

  const typingHandler = (event) => {
    setTextMessage(event);
    if (event) {
      let isTypingValue = false;
      if (!typing) {
        setTyping(true);
        isTypingValue = true;
        socket.emit("typing", currentChat?._id);
      }

      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        if (timeNow - lastTypingTime >= timerLength && isTypingValue) {
          setTyping(false);
          socket.emit("stop-typing", currentChat?._id);
        }
      }, timerLength);
    }
  };

  const handleOnEnter = () => {
    socket.emit("stop-typing", currentChat?._id);
    sendTextMessage(textMessage, user, currentChat, setTextMessage);
    // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
    return () => {};
  }, [messages]);

  useEffect(() => {
    if (currentChat?._id) {
      deleteNotifications(currentChat?.members[0], currentChat?.members[1]);
    }
    return () => {
      if (currentChat?._id && (messages?.length === 0 || !messages)) {
        // deleteChat();
      }
    };
  }, [currentChat]);

  if (!receivedUser) {
    return (
      <Hidden smDown>
        <p style={{ textAlign: "center", width: "100%" }}>
          No conversation selected yet
        </p>
      </Hidden>
    );
  }

  if (isMessageLoading) {
    return (
      <Hidden smDown>
        <p style={{ textAlign: "center", width: "100%" }}>loading...</p>;
      </Hidden>
    );
  }

  return (
    <Stack spacing={4} className="chat-box">
      <div className="chat-header">
        <div>
          <Avatar sx={{ marginRight: 1.5 }}>
            <img src={receivedUser?.avatar} alt="avatar" />
          </Avatar>
        </div>
        <div className="flex">
          <strong>{receivedUser?.name}</strong>
          {isOnline ? (
            <p className="online">online</p>
          ) : (
            <p className="offline">offline...</p>
          )}
        </div>
      </div>
      <Stack spacing={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={message.text + index}
              className={`${
                message?.senderId === user?._id ? "message self" : "message"
              }`}
              ref={messagesEndRef}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      {isTyping && (
        <div id="typing-container">
          <Lottie
            autoFocus={true}
            animationData={Animation}
            style={{
              width: 75,
              height: 90,
              marginLeft: "-6px",
              marginBottom: "-28px",
            }}
            play
          />
        </div>
      )}
      <Stack
        spacing={3}
        direction={"row"}
        className="chat-input"
        alignItems={"center"}
      >
        <InputEmoji
          value={textMessage}
          onChange={(e) => typingHandler(e)}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
        <IconButton className="send-btn" onClick={handleOnEnter}>
          <SendIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
