import Room2D from "../components/Room2D";
import Room3D from "../components/Room3D";
import CategoryManager from "../components/CategoryManager.jsx";
import { AppNavbar } from "../components/layout/AppNavbar";
import Footer from "../components/layout/Footer";
import { useState, useEffect } from "react";
import { FurnitureProvider, useFurniture } from "../utils/FurnitureContext.jsx";
import { useRoom } from "../utils/RoomContext";
import { saveDesign, loadDesign } from "../utils/storage";
import { apiFetch } from "../utils/api";
import { useToast } from "../utils/ToastContext";

function RoomDesignerContent({ furnitureLibrary }) {
  const { showToast } = useToast();
  const [roomSize, setRoomSize] = useState(5);
  const [savedRooms, setSavedRooms] = useState([]);
  const [showSavedRoomsPanel, setShowSavedRoomsPanel] = useState(false);

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

  const handleSave = () => {
    saveDesign({ furniture, walls });
    showToast("Design saved locally!", "success");
  };

  const handleLoad = () => {
    const data = loadDesign();
    if (data) {
      setFurniture(data.furniture || []);
      clearRoom();
      data?.walls?.forEach((w) => addWallPoint(w.x, w.y));
      showToast("Local design loaded!", "success");
    } else showToast("No design found", "warning");
  };

  const handleSaveRoom = async () => {
    if (!getLiveFurniture().length && !walls.length) {
      showToast("Add walls or furniture before saving.", "warning");
      return;
    }
    const roomData = {
      name: `Room ${new Date().toLocaleString()}`,
      roomSize,
      walls,
      furniture: getLiveFurniture(),
    };
    try {
      const res = await apiFetch("/api/rooms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      await res.json();
      showToast("Room saved!", "success");
      fetchSavedRooms();
    } catch (error) {
      console.error(error);
      showToast("Failed to save room.", "error");
    }
  };

  const fetchSavedRooms = async () => {
    try {
      const res = await apiFetch("/api/rooms/all");
      const data = await res.json();
      setSavedRooms(data || []);
      setShowSavedRoomsPanel(true);
    } catch (error) {
      console.error(error);
      showToast("Failed to load rooms.", "error");
    }
  };

  const loadRoomById = (room) => {
    setRoomSize(room.roomSize || 5);
    setFurniture(room.furniture || []);
    clearRoom();
    room?.walls?.forEach((w) => addWallPoint(w.x, w.y));
    setShowSavedRoomsPanel(false);
    showToast(`Loaded room: ${room.name}`, "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      <div className="flex flex-col lg:flex-row pt-16">
        {/* SIDEBAR */}
        <div className="w-full lg:w-80 bg-white lg:border-r border-b lg:border-b-0 border-gray-100 p-4 overflow-y-auto max-h-[50vh] lg:max-h-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg shrink-0">

          {/* Manage Categories */}
          <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-[15px] font-semibold mb-2.5 text-gray-800 cursor-pointer">Manage Categories</div>
            <div className="block">
              <CategoryManager furnitureLibrary={furnitureLibrary} />
            </div>
          </div>

          {/* Furniture Library */}
          <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-[15px] font-semibold mb-2.5 text-gray-800 cursor-pointer">Furniture Library</div>
            <div className="block max-h-[350px] overflow-y-auto pr-1.5 mt-1.5 border-t border-gray-100 pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg">
              {Object.keys(furnitureLibrary || {}).map((category) => (
                <div key={category} className="mb-4">
                  <div className="text-[13px] font-semibold text-orange-500 mb-1.5 uppercase tracking-wider">{category}</div>
                  <div className="flex flex-col gap-2.5">
                    {furnitureLibrary[category]?.map((design) => (
                      <div key={design._id} className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-orange-50 hover:border-orange-200 border border-transparent">
                        <img
                          src={design.image}
                          alt={design.name}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1 text-sm text-gray-700">{design.name}</div>
                        <button onClick={() => addFurniture(category, design._id)} className="bg-orange-500 hover:bg-orange-600 border-none rounded-lg py-1.5 px-2.5 text-xs text-white font-medium cursor-pointer transition-colors">
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Rooms */}
          <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div
              className="text-[15px] font-semibold mb-2.5 text-gray-800 cursor-pointer"
              onClick={() => setShowSavedRoomsPanel(!showSavedRoomsPanel)}
            >
              Saved Rooms
            </div>
            <div className={`${showSavedRoomsPanel ? "block" : "hidden"} max-h-[250px] overflow-y-auto pr-1.5 mt-1.5 border-t border-gray-100 pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg`}>
              {savedRooms.length === 0 ? (
                <p className="text-sm text-gray-500">No rooms found</p>
              ) : (
                savedRooms.map((room) => (
                  <div key={room._id} className="flex justify-between bg-gray-50 p-2 rounded-lg mb-2">
                    <span className="text-sm text-gray-700 truncate flex-1 mr-2">{room.name}</span>
                    <button
                      onClick={() => loadRoomById(room)}
                      className="bg-orange-500 hover:bg-orange-600 border-none rounded-lg py-1.5 px-2.5 text-xs text-white font-medium cursor-pointer transition-colors shrink-0"
                    >
                      Load
                    </button>
                  </div>
                ))
              )}
              <button onClick={fetchSavedRooms} className="mt-2 w-full py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Refresh</button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-[15px] font-semibold mb-2.5 text-gray-800 cursor-pointer">
              Room Visualization Controls
            </div>
            <div className="block">
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Size</label>
              <input
                type="number"
                value={roomSize}
                min={1}
                max={20}
                onChange={(e) => setRoomSize(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mt-1.5"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={handleSaveRoom} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors">Save Room</button>
                <button onClick={clearRoom} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors">Clear</button>
                <button onClick={undoFurniture} disabled={!canUndoFurniture} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Undo F</button>
                <button onClick={redoFurniture} disabled={!canRedoFurniture} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Redo F</button>
                <button onClick={undoWall} disabled={!canUndoWall} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Undo W</button>
                <button onClick={redoWall} disabled={!canRedoWall} className="flex-1 min-w-20 py-2 rounded-lg border-none bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Redo W</button>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN AREA */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="mb-2 text-base font-semibold text-gray-800">2D Room Layout</h3>
            <Room2D roomSize={roomSize} />
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="mb-2 text-base font-semibold text-gray-800">3D Room Visualization</h3>
            <Room3D roomSize={roomSize} furniture={furniture} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function RoomDesigner() {
  const [furnitureLibrary, setFurnitureLibrary] = useState({});

  useEffect(() => {
    apiFetch("/api/furniture/all")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        (data || []).forEach((item) => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        });
        setFurnitureLibrary(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <FurnitureProvider furnitureLibrary={furnitureLibrary}>
      <RoomDesignerContent furnitureLibrary={furnitureLibrary} />
    </FurnitureProvider>
  );
}