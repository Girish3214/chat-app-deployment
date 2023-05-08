import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import ErrorPage from "../pages/error/ErrorPage";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import SetAvatar from "../pages/avatar/SetAvatar";
import { useGlobalContext } from "../store/authContext";
import ChatBox from "./chats/ChatBox";
import { Hidden } from "@mui/material";

const RouterComponent = () => {
  const { user } = useGlobalContext();

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
        <Route path="/login" element={user ? <HomePage /> : <LoginPage />} />
        <Route
          path="/register"
          element={user ? <HomePage /> : <RegisterPage />}
        />
        <Route
          path="/setAvatar"
          element={user?.avatar ? <HomePage /> : <SetAvatar />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default RouterComponent;
