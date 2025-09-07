'use client';

import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { Leva, button, useControls } from 'leva';
import { useRef, useState, useTransition } from 'react';

import { Env } from '../components/env';
import { Actions } from './consts';
import { RubiksCube, RubiksCubeRef } from './rubiks-cube';

export const Canvas = () => {
  const rubiksCubeRef = useRef<RubiksCubeRef>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const [background, setBackground] = useState<PresetsType>('sunset');

  const { cubeRoughness, cubeSpeed } = useControls({
    cubeRoughness: { value: 0.5, min: 0.2, max: 0.8 },
    cubeSpeed: { value: 2, min: 1, max: 10 },
    background: {
      value: background,
      options: ['sunset', 'dawn', 'forest'],
      onChange: (value) => startTransition(() => setBackground(value)),
    },
    Scramble: button(() => {
      const scrambleSteps = Array.from({ length: 20 }, () => Actions[Math.floor(Math.random() * Actions.length)]);
      rubiksCubeRef.current?.rotate(scrambleSteps);
    }),
  });

  return (
    <>
      <Leva />
      <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <RubiksCube ref={rubiksCubeRef} cubeRoughness={cubeRoughness} cubeSpeed={cubeSpeed} />
        <Env background={background} />
      </ThreeCanvas>
    </>
  );
};
