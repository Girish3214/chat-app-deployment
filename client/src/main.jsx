import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { AppAuthProvider } from "./store/authContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppAuthProvider>
      <ThemeProvider theme={darkTheme}>
        <App />
        <CssBaseline />
      </ThemeProvider>
    </AppAuthProvider>
  </BrowserRouter>
);
