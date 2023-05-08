import { useState, useEffect } from "react";
import { getRequest } from "../uitils/serviceCalls";
import { getUserApi } from "../uitils/apiUrls";

function useFetchReceiverUser(chat, user) {
  const [receivedUser, setReceivedUser] = useState(null);
  const [error, setError] = useState(null);

  const receiverId = chat?.members?.find((id) => id !== user?._id);
  const getUser = async () => {
    if (!receiverId) return null;

    const response = await getRequest(`${getUserApi}/${receiverId}`);

    if (response.error) {
      return setError(response);
    }
    setReceivedUser(response);
  };
  useEffect(() => {
    getUser();

    return () => {};
  }, [receiverId]);

  return { receivedUser, error };
}
export default useFetchReceiverUser;
