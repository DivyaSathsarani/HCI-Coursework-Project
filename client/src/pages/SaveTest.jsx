import React from "react";
import { saveRoomFromLocalStorage } from "../utils/saveRoomToDB";
import { useToast } from "../utils/ToastContext";

export default function SaveTest() {
  const { showToast } = useToast();
  return (
    <div style={{ padding: 20 }}>
      <h2>Test Save Room</h2>
      <button onClick={() => saveRoomFromLocalStorage(showToast)}>
        Save Current Room to DB
      </button>
    </div>
  );
}