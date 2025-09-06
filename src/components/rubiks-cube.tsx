import { Fragment } from "react";
import { CubePiece } from "./cube-piece";
import { RotationPanel } from "./rotation-panel";
import { FacingDirection } from "./consts";
import { Rotator } from "./rotator";

const CUBE_POSITIONS: Array<[number, number, number]> = [];
for (let x = -0.5; x <= 0.5; x++) {
  for (let y = -0.5; y <= 0.5; y++) {
    for (let z = -0.5; z <= 0.5; z++) {
      CUBE_POSITIONS.push([x, y, z]);
    }
  }
}

type RubiksCubeProps = {
  roughness: number;
};

export const RubiksCube = ({ roughness }: RubiksCubeProps) => {
  return (
    <group>
      {CUBE_POSITIONS.map((position) => (
        <CubePiece
          key={position.join(",")}
          initialPosition={position}
          roughness={roughness}
        />
      ))}
      {["front", "back", "left", "right", "top", "bottom"].map((face) => (
        <Rotator key={face} facingDirection={face as FacingDirection} />
      ))}
    </group>
  );
};
