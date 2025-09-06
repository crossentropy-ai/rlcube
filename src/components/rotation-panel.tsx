"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

type RotationPanelProps = {
  direction: "clockwise" | "counter-clockwise";
  face: "front" | "back" | "left" | "right" | "top" | "bottom";
};

export const RotationPanel = ({ direction, face }: RotationPanelProps) => {
  const clockwise = direction === "clockwise";
  const texture = useLoader(TextureLoader, `/textures/${direction}.png`);
  const position: Record<string, [number, number, number]> = {
    front: clockwise ? [0.5, 0, 1.01] : [-0.5, 0, 1.01],
    back: clockwise ? [-0.5, 0, -1.01] : [0.5, 0, -1.01],
    left: clockwise ? [-1.01, 0, 0.5] : [-1.01, 0, -0.5],
    right: clockwise ? [1.01, 0, -0.5] : [1.01, 0, 0.5],
  };
  const rotation: Record<string, [number, number, number]> = {
    front: [0, 0, 0],
    back: [0, Math.PI, 0],
    left: [0, -Math.PI / 2, 0],
    right: [0, Math.PI / 2, 0],
  };
  return (
    <mesh position={position[face]} rotation={rotation[face]}>
      <planeGeometry args={[0.8, 1.6]} />
      <meshStandardMaterial
        color={"#aaaaaa"}
        roughness={0.5}
        opacity={0.7}
        map={texture}
        transparent
      />
    </mesh>
  );
};
