export async function saveLiveRoom(furnitureContext, roomContext, roomSize = 5, showToast) {
  const furniture = furnitureContext.getLiveFurniture();
  const walls = roomContext?.getLiveWalls?.() ?? roomContext?.walls ?? [];

  if (!walls || !furniture) {
    if (showToast) showToast("Nothing to save!", "warning");
    return;
  }

  const roomData = {
    name: `Room ${new Date().toLocaleString()}`,
    roomSize,
    walls,
    furniture,
  };

  try {
    const res = await fetch("/api/rooms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    const data = await res.json();
    console.log("Saved room:", data);
    if (showToast) showToast(`Room saved successfully: ${data.name}`, "success");
  } catch (err) {
    console.error("Save error:", err);
    if (showToast) showToast("Failed to save room to database.", "error");
  }
}