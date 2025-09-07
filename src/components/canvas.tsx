'use client';

import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { useControlContext } from '@/contexts/control-context';

import { Env } from '../components/env';
import { RubiksCube, RubiksCubeRef } from './rubiks-cube';

export const Canvas = () => {
  const rubiksCubeRef = useRef<RubiksCubeRef>(null);
  const { cubeRoughness, cubeSpeed, background, setRubiksCubeRef } = useControlContext();

  useEffect(() => setRubiksCubeRef(rubiksCubeRef), [setRubiksCubeRef]);

  return (
    <>
      <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <RubiksCube ref={rubiksCubeRef} cubeRoughness={cubeRoughness} cubeSpeed={cubeSpeed} />
        <Env background={background} />
      </ThreeCanvas>
    </>
  );
};
