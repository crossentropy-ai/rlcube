import { CubePiece } from "./cube-piece";

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
          position={position}
          roughness={roughness}
        />
      ))}
    </group>
  );
};
