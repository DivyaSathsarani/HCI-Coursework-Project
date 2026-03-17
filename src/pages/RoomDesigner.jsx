import "./RoomDesigner.css";
import Room2D from "../components/Room2D";
import Room3D from "../components/Room3D";
import CategoryManager from "../components/CategoryManager.jsx";
import { useState, useEffect } from "react";
import { FurnitureProvider, useFurniture } from "../utils/FurnitureContext.jsx";
import { useRoom } from "../utils/RoomContext";
import { saveDesign, loadDesign } from "../utils/storage";

function RoomDesignerContent({ furnitureLibrary }) {
  const [roomSize, setRoomSize] = useState(5);
  const [savedRooms, setSavedRooms] = useState([]);
  const [showSavedRoomsPanel, setShowSavedRoomsPanel] = useState(false);
  const [showAddFurniturePanel, setShowAddFurniturePanel] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  const {
    furniture,
    getLiveFurniture,
    addFurniture,
    setFurniture,
    undo: undoFurniture,
    redo: redoFurniture,
    canUndo: canUndoFurniture,
    canRedo: canRedoFurniture,
  } = useFurniture();

  const {
    walls,
    addWallPoint,
    clearRoom,
    undo: undoWall,
    redo: redoWall,
    canUndo: canUndoWall,
    canRedo: canRedoWall,
  } = useRoom();

  // Local storage
  const handleSave = () => {
    saveDesign({ furniture, walls });
    alert("Design saved locally!");
  };
  const handleLoad = () => {
    const data = loadDesign();
    if (data) {
      setFurniture(data.furniture || []);
      clearRoom();
      if (data.walls && Array.isArray(data.walls)) {
        data.walls.forEach((w) => addWallPoint(w.x, w.y));
      }
      alert("Local design loaded!");
    } else alert("No design found");
  };

  // Database
  const handleSaveRoom = async () => {
    if (!getLiveFurniture().length && !walls.length) {
      alert("Add walls or furniture before saving.");
      return;
    }
    const roomData = {
      name: `Room ${new Date().toLocaleString()}`,
      roomSize,
      walls,
      furniture: getLiveFurniture(),
    };
    try {
      const res = await fetch("http://localhost:5000/api/rooms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      await res.json();
      alert("Room saved to database!");
      fetchSavedRooms();
    } catch (error) {
      console.error(error);
      alert("Failed to save room.");
    }
  };

  const fetchSavedRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms/all");
      const data = await res.json();
      setSavedRooms(data);
      setShowSavedRoomsPanel(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load saved rooms.");
    }
  };

  const loadRoomById = (room) => {
    setRoomSize(room.roomSize || 5);
    setFurniture(room.furniture || []);
    clearRoom();
    if (room.walls) room.walls.forEach((w) => addWallPoint(w.x, w.y));
    setShowSavedRoomsPanel(false);
    alert(`Loaded room: ${room.name}`);
  };

  // FIXED: Toggle one category at a time (including new categories)
  const toggleCategory = (cat) => {
    setOpenCategories((prev) => {
      const allCats = Object.keys(furnitureLibrary);
      const newState = {};
      allCats.forEach((key) => {
        newState[key] = key === cat ? !prev[key] : false;
      });
      return newState;
    });
  };

  return (
    <div className="room-designer-container">
      <div className="sidebar">
        {/* Manage Categories */}
        <div className="panel">
          <div className="panel-header">Manage Categories & Furniture</div>
          <div className="panel-content show">
            <CategoryManager furnitureLibrary={furnitureLibrary} />
          </div>
        </div>

        {/* Add Furniture */}
        <div className="panel">
          <div
            className="panel-header"
            onClick={() => setShowAddFurniturePanel(!showAddFurniturePanel)}
          >
            Add Furniture
          </div>
          <div className={`panel-content ${showAddFurniturePanel ? "show" : ""}`}>
            {Object.keys(furnitureLibrary).map((category) => (
              <div key={category} className="furniture-category">
                <div
                  className="furniture-category-header"
                  onClick={() => toggleCategory(category)}
                >
                  {category} <span>{openCategories[category] ? "−" : "+"}</span>
                </div>
                <div
                  className={`furniture-category-items ${
                    openCategories[category] ? "show" : ""
                  }`}
                >
                  {furnitureLibrary[category].map((design) => (
                    <div key={design._id} className="furniture-item">
                      <img
                        src={`http://localhost:5000${design.image}`}
                        alt={design.name}
                      />
                      <button onClick={() => addFurniture(category, design._id)}>
                        {design.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Rooms */}
        <div className="panel">
          <div
            className="panel-header"
            onClick={() => setShowSavedRoomsPanel(!showSavedRoomsPanel)}
          >
            Saved Rooms
          </div>
          <div className={`panel-content ${showSavedRoomsPanel ? "show" : ""}`}>
            {savedRooms.length === 0 ? (
              <p className="no-rooms">No saved rooms found.</p>
            ) : (
              savedRooms.map((room) => (
                <div key={room._id} className="room-item">
                  <span>{room.name}</span>
                  <button onClick={() => loadRoomById(room)}>Load</button>
                </div>
              ))
            )}
            <button onClick={fetchSavedRooms}>Refresh</button>
          </div>
        </div>

        {/* Controls */}
        <div className="panel">
          <div className="panel-header">Controls</div>
          <div className="panel-content show">
            <label>Room Size:</label>
            <input
              type="number"
              value={roomSize}
              min={1}
              max={20}
              onChange={(e) => setRoomSize(Number(e.target.value))}
            />
            <div className="control-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleLoad}>Load</button>
              <button onClick={handleSaveRoom}>Save Room</button>
              <button onClick={clearRoom} className="clear-room">
                Clear Room
              </button>
              <button onClick={undoFurniture} disabled={!canUndoFurniture}>
                Undo Furniture
              </button>
              <button onClick={redoFurniture} disabled={!canRedoFurniture}>
                Redo Furniture
              </button>
              <button onClick={undoWall} disabled={!canUndoWall}>
                Undo Wall
              </button>
              <button onClick={redoWall} disabled={!canRedoWall}>
                Redo Wall
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        <div className="layout-container">
          <div className="room-2d">
            <h3>2D Layout</h3>
            <Room2D roomSize={roomSize} />
          </div>
          <div className="room-3d">
            <h3>3D View</h3>
            <Room3D roomSize={roomSize} furniture={furniture} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomDesigner() {
  const [furnitureLibrary, setFurnitureLibrary] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/furniture/all")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach((item) => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        });
        setFurnitureLibrary(grouped);
      })
      .catch((err) => console.error("Error loading furniture:", err));
  }, []);

  return (
    <FurnitureProvider furnitureLibrary={furnitureLibrary}>
      <RoomDesignerContent furnitureLibrary={furnitureLibrary} />
    </FurnitureProvider>
  );
}