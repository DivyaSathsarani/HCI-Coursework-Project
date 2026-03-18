import { useState } from "react";
import { snapToGrid } from "../utils/grid";
import { useFurniture } from "../utils/FurnitureContext.jsx";
import { useRoom } from "../utils/RoomContext";
import { FURNITURE_LIBRARY } from "../utils/furnitureLibrary.js";

const map2Dto3D = (x2D, y2D, roomSize, canvasSize) => {
  const scale = (roomSize * 2) / canvasSize;
  const x3D = x2D * scale - roomSize;
  const z3D = roomSize - y2D * scale;
  return [x3D, z3D];
};

const map3Dto2D = (x3D, z3D, roomSize, canvasSize) => {
  const scale = (roomSize * 2) / canvasSize;
  const x2D = (x3D + roomSize) / scale;
  const y2D = (roomSize - z3D) / scale;
  return [x2D, y2D];
};

const BASE_FURNITURE_SIZE = 40;

export default function Room2D({ roomSize }) {
  const { furniture = [], updateFurniture, deleteFurniture } = useFurniture() || {};
  const { walls = [], addWallPoint, updateWallPoint } = useRoom() || {};

  const [draggingId, setDraggingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [draggingWall, setDraggingWall] = useState(null);

  const canvasSize = roomSize * 60;

  const handleRoomClick = (e) => {
    if (draggingId || draggingWall !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (addWallPoint) addWallPoint(x, y);
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggingId(id);
    setSelected(id);
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left - BASE_FURNITURE_SIZE / 2);
    const y = snapToGrid(e.clientY - rect.top - BASE_FURNITURE_SIZE / 2);
    updateFurniture(draggingId, { x, y }, false);
  };

  const handleMouseUp = () => setDraggingId(null);

  const handleDrag = (e, id) => {
    const rect = e.target.parentElement.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left - BASE_FURNITURE_SIZE / 2);
    const y = snapToGrid(e.clientY - rect.top - BASE_FURNITURE_SIZE / 2);
    updateFurniture(id, { x, y }, false);
  };

  const handleWallMouseDown = (index, e) => {
    e.stopPropagation();
    setDraggingWall(index);
    const move = (ev) => handleWallMouseMove(index, ev);
    const up = () => {
      setDraggingWall(null);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleWallMouseMove = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (updateWallPoint) updateWallPoint(index, x, y);
  };

  const getFurnitureIcon = (item) => {
    const categoryList = FURNITURE_LIBRARY[item.category];
    if (!categoryList) return item.category;

    const design = categoryList.find((d) => d.id === item.designId);
    const label = design ? design.name : item.category;

    switch (item.category) {
      case "seating":
        return label.toLowerCase().includes("sofa") ? "🛋️" : "🪑";
      case "tables":
        return label.toLowerCase().includes("desk") ? "💻" : "🟫";
      case "bedroom":
        return label.toLowerCase().includes("bed") ? "🛏️" : "🪞";
      case "electronics":
        return label.toLowerCase().includes("lamp") ? "💡" : "📺";
      default:
        return label;
    }
  };

  const getFurnitureLabel = (item) => {
    const categoryList = FURNITURE_LIBRARY[item.category];
    if (!categoryList) return item.category;

    const design = categoryList.find((d) => d.id === item.designId);
    return design ? design.name : item.category;
  };

  return (
    <>
      <div
        id="room"
        className="relative border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 cursor-crosshair mb-5 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        style={{ width: canvasSize, height: canvasSize }}
        onClick={handleRoomClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {walls.map((point, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-red-500 rounded-full cursor-move z-20 shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-all duration-150 ease-out hover:scale-[1.4] hover:shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            style={{ left: point.x - 5, top: point.y - 5 }}
            onMouseDown={(e) => handleWallMouseDown(i, e)}
          />
        ))}

          <svg width="100%" height="100%" className="[&_line]:stroke-gray-800 [&_line]:stroke-[4] [&_line]:transition-[stroke] [&_line]:duration-200">
          {walls.map((p, i) => {
            if (i === 0) return null;
            const prev = walls[i - 1];
            return <line key={i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} />;
          })}
        </svg>

        {furniture.map((item) => {
          const [x2D, y2D] = item.x3D && item.z3D
            ? map3Dto2D(item.x3D, item.z3D, roomSize, canvasSize)
            : [item.x, item.y];
          const size = BASE_FURNITURE_SIZE * (item.scale || 1);

          return (
            <div
              key={item.id}
              className={`absolute flex items-center justify-center rounded-lg select-none cursor-grab shadow-sm transition-all duration-150 ease-out font-bold active:cursor-grabbing active:shadow-md ${selected === item.id ? "border-[3px] border-orange-500 ring-2 ring-orange-200" : "border border-gray-300"}`}
              draggable
              style={{
                left: Math.min(Math.max(x2D, 0), canvasSize - size),
                top: Math.min(Math.max(y2D, 0), canvasSize - size),
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${item.color || "#888"}, #555)`,
                transform: `rotate(${item.rotation || 0}deg)`,
                color: "#fff",
                fontSize: "1.2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(item.id);
              }}
              onDrag={(e) => handleDrag(e, item.id)}
            >
              <span>{getFurnitureIcon(item)}</span>
              <span className="text-[0.65rem] mt-0.5 capitalize text-gray-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] whitespace-nowrap">{getFurnitureLabel(item)}</span>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-200" style={{ width: canvasSize }}>
          <h4 className="mb-3 text-xl text-gray-900">Furniture Controls</h4>

          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-700 mr-2">Scale: </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={furniture.find((f) => f.id === selected)?.scale || 1}
              onChange={(e) =>
                updateFurniture(selected, { scale: Number(e.target.value) })
              }
              className="w-[70%] accent-orange-500"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-700 mr-2">Rotation: </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={furniture.find((f) => f.id === selected)?.rotation || 0}
              onChange={(e) =>
                updateFurniture(selected, { rotation: Number(e.target.value) })
              }
              className="w-[70%] accent-orange-500"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-700 mr-2">Color: </label>
            <input
              type="color"
              value={furniture.find((f) => f.id === selected)?.color || "#888"}
              onChange={(e) =>
                updateFurniture(selected, { color: e.target.value })
              }
              className="w-10 h-7 rounded-md border-none cursor-pointer"
            />
          </div>

          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg border-none cursor-pointer text-sm font-semibold transition-colors"
            onClick={() => {
              deleteFurniture(selected);
              setSelected(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}