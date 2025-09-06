"ue client";

import { useState, useTransition } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { useControls } from "leva";

export const Env = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const [preset, setPreset] = useState<PresetsType>("sunset");
  useControls({
    preset: {
      value: preset,
      options: ["sunset", "dawn", "forest"],
      onChange: (value) => startTransition(() => setPreset(value)),
    },
  });
  return (
    <>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={-Math.PI}
        maxPolarAngle={Math.PI}
      />
      <Environment preset={preset} background blur={1} />
    </>
  );
};
