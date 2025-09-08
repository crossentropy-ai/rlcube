'use client';

import { useLoader } from '@react-three/fiber';
import { useState } from 'react';
import { TextureLoader } from 'three';

import { useControlContext } from '@/contexts/control-context';

import { FacingDirection, RotationDirection, RotationStep, Rotations } from './consts';

type RotationPanelProps = {
  facingDirection: FacingDirection;
  direction: RotationDirection;
  onClick?: (step: RotationStep) => void;
};

export const RotationPanel = ({ facingDirection, direction, onClick }: RotationPanelProps) => {
  const { showRotationIndicators } = useControlContext();
  const clockwise = direction === 'clockwise';
  const texture = useLoader(TextureLoader, `/textures/${direction}.png`);
  const [opacity, setOpacity] = useState(0);

  const position: Record<FacingDirection, [number, number, number]> = {
    front: clockwise ? [0.5, 0, 1.01] : [-0.5, 0, 1.01],
    back: clockwise ? [-0.5, 0, -1.01] : [0.5, 0, -1.01],
    left: clockwise ? [-1.01, 0, 0.5] : [-1.01, 0, -0.5],
    right: clockwise ? [1.01, 0, -0.5] : [1.01, 0, 0.5],
    up: clockwise ? [0.5, 1.01, 0] : [-0.5, 1.01, 0],
    down: clockwise ? [0.5, -1.01, 0] : [-0.5, -1.01, 0],
  };

  const handleClick = () => onClick?.({ faceDirection: facingDirection, direction });

  return (
    <mesh
      position={position[facingDirection]}
      rotation={Rotations[facingDirection]}
      onPointerEnter={() => {
        setOpacity(1);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setOpacity(0);
        document.body.style.cursor = 'default';
      }}
      onClick={handleClick}
    >
      <planeGeometry args={[0.8, 1.6]} />
      <meshStandardMaterial
        color={'#aaaaaa'}
        roughness={0.5}
        opacity={showRotationIndicators ? 1 : opacity}
        map={texture}
        transparent
      />
    </mesh>
  );
};
