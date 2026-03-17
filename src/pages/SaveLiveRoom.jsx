import React from "react";
import { useRoom } from "../utils/RoomContext";
import { useFurniture } from "../utils/FurnitureContext";
import { saveLiveRoom } from "../utils/saveLiveRoom";

export default function SaveLiveRoom() {
  const roomContext = useRoom();
  const furnitureContext = useFurniture();

  return (
    <div style={{ padding: 20 }}>
      <h2>Save Current Room</h2>
      <button
        onClick={() => saveLiveRoom(furnitureContext, roomContext)}
      >
        Save Room to Database
      </button>
      <p>Walls: {roomContext.getLiveWalls().length}</p>
      <p>Furniture: {furnitureContext.getLiveFurniture().length}</p>
    </div>
  );
}