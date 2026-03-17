// saveRoomToDB.js
export async function saveRoomFromLocalStorage() {
  // Try to get from localStorage (or set dummy data if empty)
  let saved = localStorage.getItem("room_design");
  if (!saved) {
    // If nothing is in localStorage, use dummy test data
    saved = JSON.stringify({
      furniture: [
        {
          id: Date.now(),
          category: "chair",
          designId: "test123",
          model: "/models/test.glb",
          x: 50,
          y: 50,
          scale: 1,
          size: [1,1,1],
          rotation: 0,
          color: "#888"
        }
      ],
      walls: [
        { x: 10, y: 10 },
        { x: 100, y: 10 },
        { x: 100, y: 100 }
      ]
    });
    localStorage.setItem("room_design", saved);
    console.log("No local design found, using dummy test data.");
  }

  const data = JSON.parse(saved);

  const roomData = {
    name: `Test Room ${new Date().toLocaleString()}`,
    roomSize: 5,
    furniture: data.furniture,
    walls: data.walls,
  };

  try {
    const res = await fetch("http://localhost:5000/api/rooms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });
    const resp = await res.json();
    console.log("Saved to server:", resp);
    alert("Room saved to database!");
  } catch (err) {
    console.error("Error saving room:", err);
    alert("Failed to save room to database.");
  }
}