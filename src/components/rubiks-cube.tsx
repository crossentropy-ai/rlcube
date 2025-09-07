import { useRef, forwardRef, useImperativeHandle } from "react";
import { CubePiece } from "./cube-piece";
import { Rotator, RotatorRef } from "./rotator";
import { CubesProvider } from "@/contexts/cubes-context";
import { Group } from "three";
import { FacingDirection } from "./consts";

const CUBE_POSITIONS: Array<[number, number, number]> = [];
for (let x = -0.5; x <= 0.5; x += 1) {
  for (let y = -0.5; y <= 0.5; y += 1) {
    for (let z = -0.5; z <= 0.5; z += 1) {
      CUBE_POSITIONS.push([x, y, z]);
    }
  }
}

export type RubiksCubeRef = {
  scramble: (
    steps: Array<{
      faceDirection: FacingDirection;
      direction: "clockwise" | "counter-clockwise";
    }>,
  ) => void;
};

type RubiksCubeProps = {
  cubeRoughness: number;
  cubeSpeed: number;
};

export const RubiksCube = forwardRef<RubiksCubeRef, RubiksCubeProps>(
  ({ cubeRoughness, cubeSpeed }, ref) => {
    const cubeGroupRef = useRef<Group | null>(null);
    const rotatorRef = useRef<RotatorRef | null>(null);

    useImperativeHandle(ref, () => ({
      scramble: (
        steps: Array<{
          faceDirection: FacingDirection;
          direction: "clockwise" | "counter-clockwise";
        }>,
      ) => rotatorRef.current?.rotate(steps),
    }));

    return (
      <CubesProvider cubeGroupRef={cubeGroupRef}>
        <group ref={cubeGroupRef}>
          {CUBE_POSITIONS.map((position) => (
            <CubePiece
              key={position.join(",")}
              initialPosition={position}
              roughness={cubeRoughness}
            />
          ))}
        </group>
        <Rotator ref={rotatorRef} cubeSpeed={cubeSpeed} />
      </CubesProvider>
    );
  },
);

RubiksCube.displayName = "RubiksCube";
