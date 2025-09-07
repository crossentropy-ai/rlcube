'use client';

import { RoundedBox } from '@react-three/drei';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Mesh } from 'three';

import { CubeColors, FacingDirection, Rotations } from './consts';
import { rotationController } from './rotation-controller';

export type CubePieceRef = {
  resetPosition: () => void;
};

type CubePieceProps = {
  roughness: number;
  initialPosition: [number, number, number];
};

export const CubePiece = forwardRef<CubePieceRef, CubePieceProps>(({ roughness, initialPosition }, ref) => {
  const [x, y, z] = initialPosition;

  const meshRef = useRef<Mesh | null>(null);
  useEffect(() => {
    if (meshRef.current) {
      rotationController.addCube(meshRef.current);
    }
  }, [meshRef]);

  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      meshRef.current?.position.set(x, y, z);
      meshRef.current?.rotation.set(0, 0, 0);
    },
  }));

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
    right: [0.48, 0, 0],
    left: [-0.48, 0, 0],
    top: [0, 0.48, 0],
    bottom: [0, -0.48, 0],
  };

  return (
    <mesh position={[x, y, z]} ref={meshRef}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#2a2a2a" metalness={1} roughness={roughness} />
      </RoundedBox>

      {Object.entries(visibleFaces).map(([face, isVisible]) => {
        if (!isVisible) return null;
        const color = CubeColors[face as keyof typeof CubeColors];
        return (
          <mesh
            key={face}
            position={positions[face as FacingDirection]}
            rotation={Rotations[face as FacingDirection]}
            userData={{
              isFace: true,
              faceDirection: face,
              faceColor: color,
            }}
          >
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial color={color} metalness={1} roughness={roughness} />
          </mesh>
        );
      })}
    </mesh>
  );
});

CubePiece.displayName = 'CubePiece';
