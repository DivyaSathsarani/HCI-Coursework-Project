import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { AuthProvider } from "./utils/AuthContext";
import { RoomProvider } from "./utils/RoomContext";
import { FurnitureProvider } from "./utils/FurnitureContext";
import { ToastProvider } from "./utils/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastProvider>
      <AuthProvider>
        <RoomProvider>
          <FurnitureProvider>
            <App />
          </FurnitureProvider>
        </RoomProvider>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);