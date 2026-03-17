import { useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { TextureLoader } from "three";
import { useRoom } from "../utils/RoomContext";
import { useFurniture } from "../utils/FurnitureContext.jsx";
import { FLOOR_TEXTURES, WALL_TEXTURES } from "../utils/textures.js";
import "./Room3D.css";

/* ===== 2D -> 3D POSITION CONVERTER ===== */
const map2Dto3D = (x2D, y2D, roomSize, canvasSize) => {
  const scale = (roomSize * 2) / canvasSize;
  const x3D = x2D * scale - roomSize;
  const z3D = roomSize - y2D * scale;
  return [x3D, z3D];
};

/* ===== GLB MODEL LOADER ===== */
function FurnitureModel({ model, position, scale, rotation }) {
  const { scene } = useGLTF(`http://localhost:5000${model}`);
  const clonedScene = scene.clone();

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

export default function Room3D({ roomSize }) {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [floorTextureKey, setFloorTextureKey] = useState("plain");
  const [wallTextureKey, setWallTextureKey] = useState("plain");

  const floorTexture = useLoader(TextureLoader, FLOOR_TEXTURES[floorTextureKey]);
  const wallTexture = useLoader(TextureLoader, WALL_TEXTURES[wallTextureKey]);

  const { walls = [] } = useRoom() || {};
  const { furniture = [] } = useFurniture() || {};

  const canvasSize = roomSize * 60;

  return (
    <div className="room3d-container">

      {/* FLOOR / WALL SELECT */}
      <div className="texture-controls">
        <label>Floor: </label>
        <select
          value={floorTextureKey}
          onChange={(e) => setFloorTextureKey(e.target.value)}
        >
          {Object.keys(FLOOR_TEXTURES).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label>Wall: </label>
        <select
          value={wallTextureKey}
          onChange={(e) => setWallTextureKey(e.target.value)}
        >
          {Object.keys(WALL_TEXTURES).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* 3D ROOM */}
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [roomSize * 2, 6, roomSize * 2], fov: 50 }}
        >

          <ambientLight intensity={lightIntensity} />
          <hemisphereLight intensity={0.5} />
          <directionalLight
            position={[roomSize * 2, 10, roomSize * 2]}
            intensity={0.7}
            castShadow
          />

          {/* FLOOR */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[roomSize * 2, roomSize * 2]} />
            <meshStandardMaterial map={floorTexture} />
          </mesh>

          {/* WALLS */}
          {walls.map((p, i) => {
            if (i === 0) return null;
            const prev = walls[i - 1];
            const [x1, z1] = map2Dto3D(prev.x, prev.y, roomSize, canvasSize);
            const [x2, z2] = map2Dto3D(p.x, p.y, roomSize, canvasSize);

            const dx = x2 - x1;
            const dz = z2 - z1;

            const length = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dz, dx);

            return (
              <mesh
                key={i}
                position={[(x1 + x2) / 2, 1.5, (z1 + z2) / 2]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[length, 3, 0.1]} />
                <meshStandardMaterial map={wallTexture} />
              </mesh>
            );
          })}

          {/* FURNITURE */}
          {furniture.map((item) => {
            const [x3D, z3D] = map2Dto3D(item.x, item.y, roomSize, canvasSize);
            const rotationY = ((item.rotation || 0) * Math.PI) / 180;
            const scale = item.scale || 1;

            if (item.model) {
              return (
                <FurnitureModel
                  key={item.id}
                  model={item.model}
                  position={[x3D, 0, z3D]}
                  scale={[scale, scale, scale]}
                  rotation={[0, rotationY, 0]}
                />
              );
            }

            return (
              <mesh
                key={item.id}
                position={[x3D, 0.5, z3D]}
                rotation={[0, rotationY, 0]}
                scale={[scale, scale, scale]}
              >
                <boxGeometry />
                <meshStandardMaterial color={item.color || "#888"} />
              </mesh>
            );
          })}

          <OrbitControls />
        </Canvas>
      </div>

      {/* LIGHT CONTROL */}
      <div className="light-control">
        <label>Light Intensity: </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={lightIntensity}
          onChange={(e) => setLightIntensity(Number(e.target.value))}
        />
      </div>

    </div>
  );
}