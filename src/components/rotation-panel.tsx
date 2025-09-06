"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Rotations, FacingDirection } from "./consts";
import { useState } from "react";

type RotationPanelProps = {
  direction: "clockwise" | "counter-clockwise";
  facingDirection: FacingDirection;
  onClick?: (
    facingDirection: FacingDirection,
    direction: "clockwise" | "counter-clockwise",
  ) => void;
};

export const RotationPanel = ({
  direction,
  facingDirection,
  onClick,
}: RotationPanelProps) => {
  const clockwise = direction === "clockwise";
  const texture = useLoader(TextureLoader, `/textures/${direction}.png`);
  const [opacity, setOpacity] = useState(0);

  const position: Record<FacingDirection, [number, number, number]> = {
    front: clockwise ? [0.5, 0, 1.01] : [-0.5, 0, 1.01],
    back: clockwise ? [-0.5, 0, -1.01] : [0.5, 0, -1.01],
    left: clockwise ? [-1.01, 0, 0.5] : [-1.01, 0, -0.5],
    right: clockwise ? [1.01, 0, -0.5] : [1.01, 0, 0.5],
    top: clockwise ? [0.5, 1.01, 0] : [-0.5, 1.01, 0],
    bottom: clockwise ? [0.5, -1.01, 0] : [-0.5, -1.01, 0],
  };

  const handleClick = () => {
    onClick?.(facingDirection, direction);
  };

  return (
    <mesh
      position={position[facingDirection]}
      rotation={Rotations[facingDirection]}
      onPointerEnter={() => {
        setOpacity(1);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setOpacity(0);
        document.body.style.cursor = "default";
      }}
      onClick={handleClick}
    >
      <planeGeometry args={[0.8, 1.6]} />
      <meshStandardMaterial
        color={"#aaaaaa"}
        roughness={0.5}
        opacity={opacity}
        map={texture}
        transparent
      />
    </mesh>
  );
};
