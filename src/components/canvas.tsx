"use client";

import { useControls } from "leva";
import { Canvas as ThreeCanvas } from "@react-three/fiber";

import { Env } from "../components/env";
import { CubePiece } from "@/components/cube-piece";

export const Canvas = () => {
  const { roughness } = useControls({
    roughness: { value: 1, min: 0, max: 1 },
  });

  return (
    <ThreeCanvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <CubePiece roughness={roughness} />
      <Env />
    </ThreeCanvas>
  );
};
