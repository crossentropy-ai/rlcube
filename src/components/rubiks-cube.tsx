import { CubePiece } from "./cube-piece";
import { RotationPanel } from "./rotation-panel";

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
      <RotationPanel direction="clockwise" face="front" />
      <RotationPanel direction="counter-clockwise" face="front" />
      <RotationPanel direction="clockwise" face="back" />
      <RotationPanel direction="counter-clockwise" face="back" />
      <RotationPanel direction="clockwise" face="left" />
      <RotationPanel direction="counter-clockwise" face="left" />
      <RotationPanel direction="clockwise" face="right" />
      <RotationPanel direction="counter-clockwise" face="right" />
    </group>
  );
};
