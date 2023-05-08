import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

import { postRequest, getRequest, deleteRequest } from "../uitils/serviceCalls";
import {
  getChatsApi,
  getUserApi,
  messagesApi,
  notificationApi,
} from "../uitils/apiUrls";

const AppChatContext = createContext();

const AppChatProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  const [allUsers, setAllUsers] = useState([]);

  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [sendMessagesError, setSendMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [potentialChats, setPotentialChats] = useState([]);

  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  const [notifications, setNotification] = useState([]);

  const [newChats, setNewChats] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    getNotificationsIfOffline(user);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  const sendNotificationsIfOffline = async (senderId, receiverId) => {
    const response = await postRequest(notificationApi, {
      date: new Date(),
      isRead: false,
      senderId,
      receiverId,
    });
    if (response.error) {
      return response.error;
    }
  };

  // send messages
  useEffect(() => {
    if (socket === null) return;

    const receiverId = currentChat?.members?.find((id) => id !== user?._id);
    const senderId = currentChat?.members?.find((id) => id === user?._id);

    socket.emit("sendMessage", {
      ...newMessage,
      receiverId,
    });
    const isOnline = onlineUser.some((user) => user?.userId === receiverId);
    if (!isOnline) {
      sendNotificationsIfOffline(senderId, receiverId);
    }
    return () => {};
  }, [newMessage]);

  const getNotificationsIfOffline = useCallback(async (receiver) => {
    if (receiver?._id) {
      const response = await getRequest(`${notificationApi}/${receiver._id}`);
      setNotification(response);
    }
  }, []);

  // Receive messages and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  const deleteNotifications = useCallback(async (currentChatId, receivedId) => {
    const response = await deleteRequest(
      `${notificationApi}/${currentChatId}/${receivedId}`
    );
  }, []);

  const createChat = useCallback(
    async (firstId, secondId) => {
      const response = await postRequest(getChatsApi, {
        firstId,
        secondId,
      });
      if (response.error) {
        return response.error;
      }
      setUserChats((prev) => [...prev, response]);
      setNewChats((prev) => [...prev, response]);
      return response;
    },
    [newChats]
  );

  const deleteChat = useCallback(async () => {
    if (newChats?.length !== 0) {
      newChats.map(async (prevChat) => {
        const response = await deleteRequest(`${getChatsApi}/${prevChat?._id}`);
        if (response.error) {
          return response.error;
        }
        const filterChat = allUsers.filter(
          (chat) => chat?._id === prevChat?._id
        );
        setUserChats((prev) => [
          ...prev.filter((chat) => chat?._id !== prevChat?._id),
        ]);
        setPotentialChats((prev) => [filterChat, ...prev]);
      });
    }
  }, [newChats]);

  const updateCurrentChat = useCallback(
    async (chat) => {
      socket.emit("joinChat", chat?._id);
      setCurrentChat(chat);
    },
    [socket]
  );

  const deleteCurrentChat = useCallback(async (chat) => {
    setCurrentChat(null);
  }, []);

  const getUsers = async () => {
    if (user) {
      const response = await getRequest(`${getUserApi}`);

      if (response.error) {
        console.log(error);
        return;
      }
      const newChats = response.filter((resUser) => {
        let isChatCreated = false;
        if (user._id === resUser._id) return false;
        if (userChats) {
          isChatCreated = userChats.some(
            (chat) =>
              chat.members[0] === resUser._id || chat.members[1] === resUser._id
          );
        }
        return !isChatCreated;
      });
      setPotentialChats(newChats);
      setAllUsers(response);
    }
  };

  useEffect(() => {
    getUsers();
    return () => {};
  }, [userChats]);

  const getUserChats = async () => {
    if (user?._id) {
      setIsChatLoading(true);
      setUserChatsError(null);
      const response = await getRequest(`${getChatsApi}/${user?._id}`);

      setIsChatLoading(false);
      if (response.error) {
        return setUserChatsError(response);
      }
      setUserChats(response);
    }
  };

  useEffect(() => {
    getUserChats();

    return () => {
      deleteChat();
    };
  }, [user]);

  useEffect(() => {
    return () => {
      deleteChat();
    };
  }, []);

  const getmessages = async () => {
    setIsMessageLoading(true);
    setMessagesError(null);
    if (currentChat?._id) {
      const response = await getRequest(`${messagesApi}/${currentChat?._id}`);

      setIsMessageLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    }
  };

  useEffect(() => {
    getmessages();

    return () => {};
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (text, sender, currentChat, setTextMessage) => {
      if (!text) return;
      const response = await postRequest(messagesApi, {
        senderId: sender._id,
        text,
        chatId: currentChat._id,
      });

      if (response.error) {
        return setSendMessagesError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
      const removedNewChats = newChats?.filter(
        (chat) => chat?._id !== currentChat?._id
      );
      setNewChats(removedNewChats);
    },
    []
  );

  const markNotificationAsRead = useCallback(
    (userNotifications, notifications) => {
      const mNotifications = notifications.map((notif) => {
        let notification;

        userNotifications?.forEach((ele) => {
          if (ele.senderId === notif.senderId) {
            notification = { ...notif, isRead: true };
          } else {
            notification = notif;
          }
        });
        return notification;
      });

      setNotification(mNotifications);
    },
    []
  );

  return (
    <AppChatContext.Provider
      value={{
        userChats,
        isChatLoading,
        userChatsError,
        potentialChats,
        currentChat,
        messages,
        isMessageLoading,
        messagesError,
        onlineUser,
        notifications,
        allUsers,
        newMessage,
        socket,
        createChat,
        deleteChat,
        updateCurrentChat,
        deleteCurrentChat,
        sendTextMessage,
        markNotificationAsRead,
        getNotificationsIfOffline,
        deleteNotifications,
      }}
    >
      {children}
    </AppChatContext.Provider>
  );
};

const useGlobalChatContext = () => {
  return useContext(AppChatContext);
};

export { AppChatContext, AppChatProvider, useGlobalChatContext };
