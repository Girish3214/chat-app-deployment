import axios from "axios";

const instance = axios.create({
  baseURL: "https://chats-app-71dq.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
