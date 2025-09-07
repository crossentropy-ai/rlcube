import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { CubePiece } from "./cube-piece";
import { Rotator, RotatorRef } from "./rotator";
import { Group } from "three";
import { RotationStep } from "./consts";
import { rotationController } from "./rotation-controller";

const CUBE_POSITIONS: Array<[number, number, number]> = [];
for (let x = -0.5; x <= 0.5; x += 1) {
  for (let y = -0.5; y <= 0.5; y += 1) {
    for (let z = -0.5; z <= 0.5; z += 1) {
      CUBE_POSITIONS.push([x, y, z]);
    }
  }
}

export type RubiksCubeRef = {
  rotate: (steps: Array<RotationStep>) => void;
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
      rotate: (steps: Array<RotationStep>) => rotatorRef.current?.rotate(steps),
    }));

    useEffect(() => {
      if (cubeGroupRef.current)
        rotationController.setCubeGroup(cubeGroupRef.current);
    }, [cubeGroupRef]);

    return (
      <>
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
      </>
    );
  },
);

RubiksCube.displayName = "RubiksCube";
