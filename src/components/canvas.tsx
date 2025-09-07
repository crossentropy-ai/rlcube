"use client";

import { useControls, Leva } from "leva";
import { Canvas as ThreeCanvas } from "@react-three/fiber";

import { Env } from "../components/env";
import { RubiksCube } from "./rubiks-cube";
import { useState, useTransition } from "react";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";

export const Canvas = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const [background, setBackground] = useState<PresetsType>("sunset");

  const { cubeRoughness, cubeSpeed } = useControls({
    cubeRoughness: { value: 0.5, min: 0.2, max: 0.8 },
    cubeSpeed: { value: 2, min: 1, max: 10 },
    background: {
      value: background,
      options: ["sunset", "dawn", "forest"],
      onChange: (value) => startTransition(() => setBackground(value)),
    },
  });

  return (
    <>
      <Leva />
      <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <RubiksCube cubeRoughness={cubeRoughness} cubeSpeed={cubeSpeed} />
        <Env background={background} />
      </ThreeCanvas>
    </>
  );
};
