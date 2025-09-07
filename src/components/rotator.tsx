import { useFrame } from '@react-three/fiber';
import { Fragment, forwardRef, useImperativeHandle } from 'react';

import { FacingDirection, RotationStep } from './consts';
import { frameCallback, rotationController } from './rotation-controller';
import { RotationPanel } from './rotation-panel';

export type RotatorRef = {
  rotate: (steps: Array<RotationStep>) => void;
};

type RotatorProps = {
  cubeSpeed: number;
};

export const Rotator = forwardRef<RotatorRef, RotatorProps>(({ cubeSpeed }: RotatorProps, ref) => {
  rotationController.setCubeSpeed(cubeSpeed);

  useImperativeHandle(ref, () => ({
    rotate: (steps: Array<RotationStep>) => rotationController.addRotationStep(...steps),
  }));

  useFrame(frameCallback);

  return (
    <>
      {['front', 'back', 'left', 'right', 'top', 'bottom'].map((facingDirection) => (
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
      ))}
    </>
  );
});

Rotator.displayName = 'Rotator';
