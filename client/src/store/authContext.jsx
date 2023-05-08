import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { postRequest } from "../uitils/serviceCalls";
import { loginApi, registerApi } from "../uitils/apiUrls";
import { useNavigate } from "react-router-dom";

const AppAuthContext = createContext();

const initialData = {
  name: "",
  email: "",
  password: "",
};

const AppAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState(initialData);
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (body) => {
    setloading(true);
    setRegisterError(null);
    const response = await postRequest(registerApi, body);
    setloading(false);
    if (response.error) {
      return setRegisterError(response);
    }
    localStorage.setItem("user", JSON.stringify(response));
    setUser(response);
    navigate("/setAvatar");
  }, []);

  const loginUser = useCallback(async (body) => {
    setloading(true);
    setLoginError(null);
    const response = await postRequest(loginApi, body);
    setloading(false);
    if (response.error) {
      return setLoginError(response);
    }
    localStorage.setItem("user", JSON.stringify(response));
    setUser(response);
    navigate("/");
    return response;
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const setAvatarUser = useCallback((data) => {
    localStorage.removeItem("user");
    localStorage.setItem("user", data);
    setUser(data);
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      navigate("/login");
    }
    return () => {};
  }, []);

  return (
    <AppAuthContext.Provider
      value={{
        user,
        registerInfo,
        registerError,
        loginError,
        loading,
        updateRegisterInfo,
        registerUser,
        loginUser,
        setRegisterError,
        setLoginError,
        logoutUser,
        setAvatarUser,
      }}
    >
      {children}
    </AppAuthContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppAuthContext);
};

export { AppAuthContext, AppAuthProvider, useGlobalContext };
