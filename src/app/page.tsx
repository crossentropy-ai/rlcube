"use client";

import { useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import {
  Center,
} from "@react-three/drei";

import { Env } from "../components/env";

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <group position={[0, -0.65, 0]}>
        <Sphere />
      </group>
      <Env />
    </Canvas>
  );
}

function Sphere() {
  const { roughness } = useControls({
    roughness: { value: 1, min: 0, max: 1 },
  });
  return (
    <Center top>
      <mesh castShadow>
        <sphereGeometry args={[0.75, 64, 64]} />
        <meshStandardMaterial metalness={1} roughness={roughness} />
      </mesh>
    </Center>
  );
}
