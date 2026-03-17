import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { RoomProvider } from "./utils/RoomContext";
import { FurnitureProvider } from "./utils/FurnitureContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RoomProvider>
        <FurnitureProvider>
          <App />
        </FurnitureProvider>
      </RoomProvider>
    </ThemeProvider>
  </React.StrictMode>
);