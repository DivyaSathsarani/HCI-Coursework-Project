export const suggestFurniture = (roomSize) => {
  if (roomSize < 200) return ["Small Table", "Single Chair"];
  if (roomSize < 400) return ["Dining Table", "Sofa", "Chair"];
  return ["Large Sofa", "Dining Set", "TV Unit"];
};
