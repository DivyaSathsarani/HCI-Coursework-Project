import { useGLTF } from "@react-three/drei";

export default function FurnitureModel({ path, position, scale, rotation }) {
  const gltf = useGLTF(path);

  return (
    <primitive
      object={gltf.scene}
      position={position}
      scale={scale}
      rotation={rotation || [0, 0, 0]} // ✅ apply rotation
      castShadow
      receiveShadow
    />
  );
}
