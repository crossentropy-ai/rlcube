"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Rotations, FacingDirection } from "./consts";

type RotationPanelProps = {
  direction: "clockwise" | "counter-clockwise";
  facingDirection: FacingDirection;
};

export const RotationPanel = ({
  direction,
  facingDirection,
}: RotationPanelProps) => {
  const clockwise = direction === "clockwise";
  const texture = useLoader(TextureLoader, `/textures/${direction}.png`);

  const position: Record<FacingDirection, [number, number, number]> = {
    front: clockwise ? [0.5, 0, 1.01] : [-0.5, 0, 1.01],
    back: clockwise ? [-0.5, 0, -1.01] : [0.5, 0, -1.01],
    left: clockwise ? [-1.01, 0, 0.5] : [-1.01, 0, -0.5],
    right: clockwise ? [1.01, 0, -0.5] : [1.01, 0, 0.5],
    top: clockwise ? [0.5, 1.01, 0] : [-0.5, 1.01, 0],
    bottom: clockwise ? [0.5, -1.01, 0] : [-0.5, -1.01, 0],
  };

  return (
    <mesh
      position={position[facingDirection]}
      rotation={Rotations[facingDirection]}
    >
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
