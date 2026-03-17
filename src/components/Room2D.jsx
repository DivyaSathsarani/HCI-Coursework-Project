import { useState } from "react";
import { snapToGrid } from "../utils/grid";
import "./Room2D.css";
import { useFurniture } from "../utils/FurnitureContext.jsx";
import { useRoom } from "../utils/RoomContext";
import { FURNITURE_LIBRARY } from "../utils/furnitureLibrary.js";

// ===== 2D <-> 3D mapping functions =====
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

const BASE_FURNITURE_SIZE = 40; // default size in pixels

export default function Room2D({ roomSize }) {
  const { furniture = [], updateFurniture, deleteFurniture } = useFurniture() || {};
  const { walls = [], addWallPoint, updateWallPoint } = useRoom() || {};

  const [draggingId, setDraggingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [draggingWall, setDraggingWall] = useState(null);

  const canvasSize = roomSize * 60;

  /* ================= ADD WALL ================= */
  const handleRoomClick = (e) => {
    if (draggingId || draggingWall !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (addWallPoint) addWallPoint(x, y);
  };

  /* ================= FURNITURE DRAG ================= */
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

  /* ================= WALL DRAG ================= */
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

  /* ================= FURNITURE ICON ================= */
  const getFurnitureIcon = (item) => {
    const categoryList = FURNITURE_LIBRARY[item.category];
    if (!categoryList) return "❓";

    const design = categoryList.find((d) => d.id === item.designId);
    if (!design) return "❓";

    switch (item.category) {
      case "seating":
        return design.name.toLowerCase().includes("sofa") ? "🛋️" : "🪑";
      case "tables":
        return design.name.toLowerCase().includes("desk") ? "💻" : "🟫";
      case "bedroom":
        return design.name.toLowerCase().includes("bed") ? "🛏️" : "🪞";
      case "electronics":
        return design.name.toLowerCase().includes("lamp") ? "💡" : "📺";
      default:
        return "❓";
    }
  };

  return (
    <>
      {/* ================= ROOM AREA ================= */}
      <div
        id="room"
        className="room-canvas"
        style={{ width: canvasSize, height: canvasSize }}
        onClick={handleRoomClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* WALL POINTS */}
        {walls.map((point, i) => (
          <div
            key={i}
            className="wall-point"
            style={{ left: point.x - 5, top: point.y - 5 }}
            onMouseDown={(e) => handleWallMouseDown(i, e)}
          />
        ))}

        {/* WALL LINES */}
        <svg
          width="100%"
          height="100%"
          className="wall-lines"
        >
          {walls.map((p, i) => {
            if (i === 0) return null;
            const prev = walls[i - 1];
            return <line key={i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} />;
          })}
        </svg>

        {/* FURNITURE */}
        {furniture.map((item) => {
          const [x2D, y2D] = item.x3D && item.z3D ? map3Dto2D(item.x3D, item.z3D, roomSize, canvasSize) : [item.x, item.y];
          const size = BASE_FURNITURE_SIZE * (item.scale || 1);

          return (
            <div
              key={item.id}
              className={`furniture-item ${selected === item.id ? "selected" : ""}`}
              draggable
              style={{
                left: Math.min(Math.max(x2D, 0), canvasSize - size),
                top: Math.min(Math.max(y2D, 0), canvasSize - size),
                width: size,
                height: size,
                background: item.color,
                transform: `rotate(${item.rotation || 0}deg)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(item.id);
              }}
              onDrag={(e) => handleDrag(e, item.id)}
            >
              {getFurnitureIcon(item)}
            </div>
          );
        })}
      </div>

      {/* ================= FURNITURE CONTROL PANEL ================= */}
      {selected && (
        <div className="furniture-control-panel" style={{ width: canvasSize }}>
          <h4>Furniture Controls</h4>

          <div className="control-item">
            <label>Scale: </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={furniture.find((f) => f.id === selected)?.scale || 1}
              onChange={(e) =>
                updateFurniture(selected, { scale: Number(e.target.value) })
              }
            />
          </div>

          <div className="control-item">
            <label>Rotation: </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={furniture.find((f) => f.id === selected)?.rotation || 0}
              onChange={(e) =>
                updateFurniture(selected, { rotation: Number(e.target.value) })
              }
            />
          </div>

          <div className="control-item">
            <label>Color: </label>
            <input
              type="color"
              value={furniture.find((f) => f.id === selected)?.color || "#888"}
              onChange={(e) =>
                updateFurniture(selected, { color: e.target.value })
              }
            />
          </div>

          <button
            className="delete-btn"
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