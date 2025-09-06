"use client";

import { useControls } from "leva";
import { Canvas as ThreeCanvas } from "@react-three/fiber";

import { Env } from "../components/env";
import { RubiksCube } from "./rubiks-cube";

export const Canvas = () => {
  const { roughness } = useControls({
    roughness: { value: 0.5, min: 0.2, max: 0.8 },
  });

  return (
    <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <RubiksCube roughness={roughness} />
      <Env />
    </ThreeCanvas>
  );
};
