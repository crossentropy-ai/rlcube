"ue client";

import { useState, useTransition } from "react";
import { Environment, CameraControls } from "@react-three/drei";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { useControls } from "leva";
import { CameraControlsImpl } from "@react-three/drei";
const { ACTION } = CameraControlsImpl;

export const Env = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();

  const [background, setBackground] = useState<PresetsType>("sunset");
  useControls({
    background: {
      value: background,
      options: ["sunset", "dawn", "forest"],
      onChange: (value) => startTransition(() => setBackground(value)),
    },
  });
  return (
    <>
      <CameraControls
        makeDefault
        polarAngle={0.8}
        azimuthAngle={0.8}
        maxPolarAngle={Math.PI / 1.2}
        minPolarAngle={-Math.PI / 1.2}
        maxDistance={10}
        minDistance={4}
        mouseButtons={{
          left: ACTION.ROTATE,
          middle: ACTION.DOLLY,
          right: ACTION.ROTATE,
          wheel: ACTION.DOLLY,
        }}
        touches={{
          one: ACTION.TOUCH_ROTATE,
          two: ACTION.TOUCH_DOLLY,
          three: ACTION.TOUCH_DOLLY,
        }}
      />
      <Environment preset={background} background blur={1} />
    </>
  );
};
