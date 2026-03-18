import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { AuthProvider } from "./utils/AuthContext";
import { RoomProvider } from "./utils/RoomContext";
import { FurnitureProvider } from "./utils/FurnitureContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RoomProvider>
          <FurnitureProvider>
            <App />
          </FurnitureProvider>
        </RoomProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);