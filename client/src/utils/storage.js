export const saveDesign = (data) => {
  localStorage.setItem("roomDesign", JSON.stringify(data));
};

export const loadDesign = () => {
  const data = localStorage.getItem("roomDesign");
  return data ? JSON.parse(data) : null;
};
