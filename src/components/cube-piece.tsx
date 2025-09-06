import { RoundedBox } from "@react-three/drei";

// Standard Rubik's cube colors
const CUBE_COLORS = {
  front: "#ff4444", // Red
  back: "#ff8800", // Orange
  left: "#44ff44", // Green
  right: "#4444ff", // Blue
  top: "#ffff44", // Yellow
  bottom: "#ffffff", // White
};

type CubePieceProps = {
  roughness: number;
  position: [number, number, number];
};

export const CubePiece = ({ roughness, position }: CubePieceProps) => {
  const [x, y, z] = position;

  const visibleFaces: Record<keyof typeof CUBE_COLORS, boolean> = {
    front: z > 0, // Front face (positive z)
    back: z < 0, // Back face (negative z)
    right: x > 0, // Right face (positive x)
    left: x < 0, // Left face (negative x)
    top: y > 0, // Top face (positive y)
    bottom: y < 0, // Bottom face (negative y)
  };

  return (
    <mesh position={position}>
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
        let stickerPosition: [number, number, number] = [0, 0, 0];
        let stickerRotation: [number, number, number] = [0, 0, 0];

        switch (face) {
          case "front":
            stickerPosition = [0, 0, 0.48];
            break;
          case "back":
            stickerPosition = [0, 0, -0.48];
            stickerRotation = [0, Math.PI, 0];
            break;
          case "right":
            stickerPosition = [0.48, 0, 0];
            stickerRotation = [0, Math.PI / 2, 0];
            break;
          case "left":
            stickerPosition = [-0.48, 0, 0];
            stickerRotation = [0, -Math.PI / 2, 0];
            break;
          case "top":
            stickerPosition = [0, 0.48, 0];
            stickerRotation = [-Math.PI / 2, 0, 0];
            break;
          case "bottom":
            stickerPosition = [0, -0.48, 0];
            stickerRotation = [Math.PI / 2, 0, 0];
            break;
        }

        return (
          <mesh
            key={face}
            position={stickerPosition}
            rotation={stickerRotation}
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
