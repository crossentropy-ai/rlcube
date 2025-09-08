import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';

import { RotationStep } from './consts';
import { CubePiece, CubePieceRef } from './cube-piece';
import { rotationController } from './rotation-controller';
import { Rotator, RotatorRef } from './rotator';

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
  reset: () => void;
};

type RubiksCubeProps = {
  cubeRoughness: number;
  cubeSpeed: number;
};

export const RubiksCube = forwardRef<RubiksCubeRef, RubiksCubeProps>(({ cubeRoughness, cubeSpeed }, ref) => {
  const cubeGroupRef = useRef<Group | null>(null);
  const rotatorRef = useRef<RotatorRef | null>(null);
  const cubePieceRefs = useRef<Map<string, CubePieceRef>>(new Map());

  useImperativeHandle(ref, () => ({
    rotate: (steps: Array<RotationStep>) => rotatorRef.current?.rotate(steps),
    reset: () => {
      rotationController.stopRotation(() => {
        cubePieceRefs.current.forEach((cubePieceRef) => {
          cubePieceRef.resetPosition();
        });
        rotationController.setState([
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [2, 2, 2, 2],
          [3, 3, 3, 3],
          [4, 4, 4, 4],
          [5, 5, 5, 5],
        ]);
        rotationController.initializeFaces();
      });
    },
  }));

  useEffect(() => {
    if (!cubeGroupRef.current) return;
    rotationController.setCubeGroup(cubeGroupRef.current);
    rotationController.initializeFaces();
  }, [cubeGroupRef]);

  return (
    <>
      <group ref={cubeGroupRef}>
        {CUBE_POSITIONS.map((position) => {
          const positionKey = position.join(',');
          return (
            <CubePiece
              key={positionKey}
              ref={(ref) => {
                if (ref) {
                  cubePieceRefs.current.set(positionKey, ref);
                } else {
                  cubePieceRefs.current.delete(positionKey);
                }
              }}
              initialPosition={position}
              roughness={cubeRoughness}
            />
          );
        })}
      </group>
      <Rotator ref={rotatorRef} cubeSpeed={cubeSpeed} />
    </>
  );
});

RubiksCube.displayName = 'RubiksCube';
