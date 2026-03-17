import React from "react";
import { saveRoomFromLocalStorage } from "../utils/saveRoomToDB";

export default function SaveTest() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test Save Room</h2>
      <button onClick={saveRoomFromLocalStorage}>
        Save Current Room to DB
      </button>
    </div>
  );
}