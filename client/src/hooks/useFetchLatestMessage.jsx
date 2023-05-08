import React, { useEffect, useState } from "react";
import { useGlobalChatContext } from "../store/chatContext";
import { getRequest } from "../uitils/serviceCalls";
import { messagesApi } from "../uitils/apiUrls";

const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useGlobalChatContext();
  const [latestMessage, setLatestMessage] = useState(null);

  const getMessages = async () => {
    if (chat?._id) {
      const response = await getRequest(`${messagesApi}/${chat?._id}`);

      if (response.error) {
        return console.log("Error in getting messages...", response.error);
      }
      const lastMessage = response[response?.length - 1];
      setLatestMessage(lastMessage);
    }
  };
  useEffect(() => {
    getMessages();

    return () => {};
  }, [notifications, newMessage]);

  return { latestMessage };
};

export default useFetchLatestMessage;
