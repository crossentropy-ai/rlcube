"ue client";

import { Environment, CameraControls } from "@react-three/drei";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { CameraControlsImpl } from "@react-three/drei";
const { ACTION } = CameraControlsImpl;

type EnvProps = {
  background: PresetsType;
};

export const Env = ({ background }: EnvProps) => {
  return (
    <>
      <CameraControls
        makeDefault
        polarAngle={0.8}
        azimuthAngle={0.8}
        maxPolarAngle={Math.PI / 1.2}
        minPolarAngle={-Math.PI / 1.2}
        distance={10}
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
