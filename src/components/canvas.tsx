"use client";

import { useControls } from "leva";
import { Canvas as ThreeCanvas } from "@react-three/fiber";

import { Env } from "../components/env";
import { RubiksCube } from "./rubiks-cube";

export const Canvas = () => {
  const { cubeRoughness, cubeSpeed } = useControls({
    cubeRoughness: { value: 0.5, min: 0.2, max: 0.8 },
    cubeSpeed: { value: 2, min: 1, max: 10 },
  });

  return (
    <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <RubiksCube cubeRoughness={cubeRoughness} cubeSpeed={cubeSpeed} />
      <Env />
    </ThreeCanvas>
  );
};
