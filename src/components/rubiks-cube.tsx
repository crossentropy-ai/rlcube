import { useRef } from "react";
import { CubePiece } from "./cube-piece";
import { Rotator } from "./rotator";
import { CubesProvider } from "@/contexts/cubes-context";
import { Group } from "three";

const CUBE_POSITIONS: Array<[number, number, number]> = [];
for (let x = -0.5; x <= 0.5; x += 1) {
  for (let y = -0.5; y <= 0.5; y += 1) {
    for (let z = -0.5; z <= 0.5; z += 1) {
      CUBE_POSITIONS.push([x, y, z]);
    }
  }
}

type RubiksCubeProps = {
  roughness: number;
};

export const RubiksCube = ({ roughness }: RubiksCubeProps) => {
  const cubeGroupRef = useRef<Group | null>(null);
  return (
    <CubesProvider cubeGroupRef={cubeGroupRef}>
      <group ref={cubeGroupRef}>
        {CUBE_POSITIONS.map((position) => (
          <CubePiece
            key={position.join(",")}
            initialPosition={position}
            roughness={roughness}
          />
        ))}
      </group>
      <Rotator />
    </CubesProvider>
  );
};
