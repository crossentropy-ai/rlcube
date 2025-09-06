"use client";

import { RoundedBox } from "@react-three/drei";
import { useRef, useState } from "react";
import { FacingDirection, Rotations } from "./consts";
import { Mesh } from "three";
import { useCubesContext } from "@/contexts/cubes-context";

// Standard Rubik's cube colors
const CUBE_COLORS = {
  front: "#ff0000", // Red
  back: "#ff00ff", // Purple
  left: "#00ff00", // Green
  right: "#0000ff", // Blue
  top: "#ffff00", // Yellow
  bottom: "#ffffff", // White
};

type CubePieceProps = {
  roughness: number;
  initialPosition: [number, number, number];
};

export const CubePiece = ({ roughness, initialPosition }: CubePieceProps) => {
  const [x, y, z] = initialPosition;
  const [position] = useState<[number, number, number]>([x, y, z]);

  const meshRef = useRef<Mesh | null>(null);
  const { addCube } = useCubesContext();
  addCube(meshRef);

  const visibleFaces: Record<FacingDirection, boolean> = {
    front: z > 0,
    back: z < 0,
    left: x < 0,
    right: x > 0,
    top: y > 0,
    bottom: y < 0,
  };
  const positions: Record<FacingDirection, [number, number, number]> = {
    front: [0, 0, 0.48],
    back: [0, 0, -0.48],
    left: [-0.48, 0, 0],
    right: [0.48, 0, 0],
    top: [0, 0.48, 0],
    bottom: [0, -0.48, 0],
  };

  return (
    <mesh position={position} ref={meshRef}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={1}
          roughness={roughness}
        />
      </RoundedBox>

      {Object.entries(visibleFaces).map(([face, isVisible]) => {
        if (!isVisible) return null;
        const color = CUBE_COLORS[face as keyof typeof CUBE_COLORS];
        return (
          <mesh
            key={face}
            position={positions[face as FacingDirection]}
            rotation={Rotations[face as FacingDirection]}
          >
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial
              color={color}
              metalness={1}
              roughness={roughness}
            />
          </mesh>
        );
      })}
    </mesh>
  );
};
