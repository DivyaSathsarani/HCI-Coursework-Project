import React, { createContext, useContext, useState } from "react";

const FurnitureContext = createContext();

// Default sizes
const DEFAULT_SIZES = {
  lamp: [0.5, 1, 0.5],
  bed: [3, 1, 2],
  desk: [2, 1, 1.2],
  wardrobe: [1.5, 2, 0.8],
  cupboard: [1, 1.5, 0.8],
  chair: [1, 1, 1],
};

export function FurnitureProvider({ children, furnitureLibrary = {} }) {
  const [history, setHistory] = useState([[]]);
  const [index, setIndex] = useState(0);

  const furniture = history[index] || [];

  // ================= HELPERS =================
  // deep clone utility
  const clone = (data) => JSON.parse(JSON.stringify(data));

  // commit new furniture state
  const commitFurniture = (newFurniture) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(clone(newFurniture));
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  // update without committing history
  const updateFurnitureNow = (newFurniture) => {
    const newHistory = [...history];
    newHistory[index] = clone(newFurniture);
    setHistory(newHistory);
  };

  // ================= LIVE GETTER =================
  const getLiveFurniture = () => furniture; // <-- reliable live furniture

  // ================= UNDO / REDO =================
  const undo = () => {
    if (index > 0) setIndex(index - 1);
  };

  const redo = () => {
    if (index < history.length - 1) setIndex(index + 1);
  };

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  // ================= FURNITURE OPERATIONS =================
  const addFurniture = (category, designId) => {
    const categoryList = furnitureLibrary[category];
    if (!categoryList) return;

    const design = categoryList.find((d) => d._id === designId);
    if (!design) return;

    const size = DEFAULT_SIZES[category.toLowerCase()] || [1, 1, 1];

    const newItem = {
      id: Date.now(),
      category,
      designId: design._id,
      model: design.model,
      x: Math.random() * 200,
      y: Math.random() * 200,
      scale: 1,
      size,
      rotation: 0,
      color: design.color || "#888",
    };

    commitFurniture([...furniture, newItem]);
  };

  const updateFurniture = (id, newProps, commit = true) => {
    const newF = furniture.map((item) =>
      item.id === id ? { ...item, ...newProps } : item
    );
    commit ? commitFurniture(newF) : updateFurnitureNow(newF);
  };

  const deleteFurniture = (id) => {
    commitFurniture(furniture.filter((item) => item.id !== id));
  };

  const setFurniture = (newFurniture) => {
    commitFurniture(newFurniture);
  };

  // ================= PROVIDER =================
  return (
    <FurnitureContext.Provider
      value={{
        furniture,
        setFurniture,
        addFurniture,
        updateFurniture,
        deleteFurniture,
        undo,
        redo,
        canUndo,
        canRedo,
        getLiveFurniture, // <-- expose the live getter
      }}
    >
      {children}
    </FurnitureContext.Provider>
  );
}

// ================= HOOK =================
export function useFurniture() {
  return useContext(FurnitureContext);
}