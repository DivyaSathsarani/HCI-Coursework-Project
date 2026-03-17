import React, { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [walls, setWalls] = useState([]);

  const addWallPoint = (x, y) => setWalls((prev) => [...prev, { x, y }]);
  const clearRoom = () => setWalls([]);
  const undo = () => setWalls((prev) => prev.slice(0, prev.length - 1));
  const redo = () => {}; // Optional: implement redo stack if needed

  const canUndo = walls.length > 0;
  const canRedo = false; // Optional
  const setWallPoints = (newWalls) => setWalls(Array.isArray(newWalls) ? newWalls : []);

  return (
    <RoomContext.Provider
      value={{
        walls,
        addWallPoint,
        clearRoom,
        undo,
        redo,
        canUndo,
        canRedo,
        setWallPoints,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}