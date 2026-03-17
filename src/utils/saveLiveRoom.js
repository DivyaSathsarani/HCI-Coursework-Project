export async function saveLiveRoom(furnitureContext, roomContext, roomSize = 5) {
  const furniture = furnitureContext.getLiveFurniture();
  const walls = roomContext.getLiveWalls();

  if (!walls || !furniture) {
    alert("Nothing to save!");
    return;
  }

  const roomData = {
    name: `Room ${new Date().toLocaleString()}`,
    roomSize,
    walls,
    furniture,
  };

  try {
    const res = await fetch("http://localhost:5000/api/rooms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    const data = await res.json();
    console.log("Saved room:", data);
    alert(`Room saved successfully: ${data.name}`);
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save room to database.");
  }
}