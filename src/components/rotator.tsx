import { FacingDirection, RotationStep } from "./consts";
import { RotationPanel } from "./rotation-panel";
import { rotationController } from "./rotation-controller";
import { forwardRef, Fragment, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";

export type RotatorRef = {
  rotate: (steps: Array<RotationStep>) => void;
};

type RotatorProps = {
  cubeSpeed: number;
};

export const Rotator = forwardRef<RotatorRef, RotatorProps>(
  ({ cubeSpeed }: RotatorProps, ref) => {
    rotationController.setCubeSpeed(cubeSpeed);

    useImperativeHandle(ref, () => ({
      rotate: (steps: Array<RotationStep>) =>
        rotationController.addRotationStep(...steps),
    }));

    useFrame(rotationController.frameCallback.bind(rotationController));

    return (
      <>
        {["front", "back", "left", "right", "top", "bottom"].map(
          (facingDirection) => (
            <Fragment key={facingDirection}>
              <RotationPanel
                direction="clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={(s) => rotationController.addRotationStep(s)}
              />
              <RotationPanel
                direction="counter-clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={(s) => rotationController.addRotationStep(s)}
              />
            </Fragment>
          ),
        )}
      </>
    );
  },
);

Rotator.displayName = "Rotator";
