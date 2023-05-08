import React from "react";
import { useGlobalChatContext } from "../../store/chatContext";
import { Avatar } from "@mui/material";
import { useGlobalContext } from "../../store/authContext";

const PotentialChats = () => {
  const { user } = useGlobalContext();
  const { potentialChats, createChat, updateCurrentChat } =
    useGlobalChatContext();

  const handlePotentialUserClick = async (newUser) => {
    const response = await createChat(user?._id, newUser?._id);
    if (response?._id) {
      updateCurrentChat(response);
    }
  };
  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((newUser, index) => (
            <div
              key={newUser._id + index}
              className="single-user"
              onClick={() => handlePotentialUserClick(newUser)}
            >
              {newUser.avatar && (
                <Avatar sx={{ width: 56, height: 56 }}>
                  <img
                    src={newUser.avatar}
                    alt={newUser.name}
                    style={{ width: 56 }}
                  />
                </Avatar>
              )}
              <div className="potential-user-name">{newUser.name}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default PotentialChats;
