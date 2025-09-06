import { RoundedBox } from "@react-three/drei";

type CubePieceProps = {
  roughness: number;
};

export const CubePiece = ({ roughness }: CubePieceProps) => {
  return (
    <mesh>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={1}
          roughness={roughness}
        />
      </RoundedBox>
    </mesh>
  );
};
