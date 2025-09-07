import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection, RotationStep } from "./consts";
import { RotationPanel } from "./rotation-panel";
import { Group } from "three";
import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";

export type RotatorRef = {
  rotate: (steps: Array<RotationStep>) => void;
};

type RotatorProps = {
  cubeSpeed: number;
};

export const Rotator = forwardRef<RotatorRef, RotatorProps>(
  ({ cubeSpeed }: RotatorProps, ref) => {
    const cubeSpeedRef = useRef(cubeSpeed);
    cubeSpeedRef.current = cubeSpeed;
    const { getCubes, cubeGroupRef } = useCubesContext();
    const rotationSteps = useRef<Array<RotationStep>>([]);

    useImperativeHandle(ref, () => ({
      rotate: (steps: Array<RotationStep>) =>
        rotationSteps.current.push(...steps),
    }));

    const frameCallback = useMemo(() => {
      let rotationStep: RotationStep | null = null;
      let rotatingGroup = new Group();

      const rotate = (step: RotationStep, group: Group, delta: number) => {
        let sign = 0;
        let axis: "x" | "y" | "z" = "x";
        switch (step.faceDirection) {
          case "front":
            sign = step.direction === "clockwise" ? -1 : 1;
            axis = "z";
            break;
          case "back":
            sign = step.direction === "clockwise" ? 1 : -1;
            axis = "z";
            break;
          case "left":
            sign = step.direction === "clockwise" ? 1 : -1;
            axis = "x";
            break;
          case "right":
            sign = step.direction === "clockwise" ? -1 : 1;
            axis = "x";
            break;
          case "top":
            sign = step.direction === "clockwise" ? -1 : 1;
            axis = "y";
            break;
          case "bottom":
            sign = step.direction === "clockwise" ? 1 : -1;
            axis = "y";
            break;
        }

        group.rotation[axis] += sign * delta * cubeSpeedRef.current;
        if (Math.abs(group.rotation[axis]) > Math.PI / 2) {
          group.rotation[axis] = (Math.PI / 2) * sign;
          return true;
        }
        return false;
      };

      return (state: unknown, delta: number) => {
        if (!cubeGroupRef.current) return;
        if (rotationSteps.current.length === 0 && !rotationStep) return;
        if (!rotationStep) {
          const step = rotationSteps.current.shift();
          if (!step) return;
          rotationStep = step;
          const cubes = getCubes(step.faceDirection);
          rotatingGroup = new Group();
          cubeGroupRef.current?.add(rotatingGroup);
          cubes.forEach((cube) => rotatingGroup.attach(cube));
        }

        const done = rotate(rotationStep, rotatingGroup, delta);
        if (done) {
          rotationStep = null;
          const children = [...rotatingGroup.children];
          children.forEach((child) => cubeGroupRef.current?.attach(child));
          cubeGroupRef.current?.remove(rotatingGroup);
        }
      };
    }, [cubeGroupRef, getCubes]);
    useFrame(frameCallback);

    return (
      <>
        {["front", "back", "left", "right", "top", "bottom"].map(
          (facingDirection) => (
            <Fragment key={facingDirection}>
              <RotationPanel
                direction="clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={(s) => rotationSteps.current.push(s)}
              />
              <RotationPanel
                direction="counter-clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={(s) => rotationSteps.current.push(s)}
              />
            </Fragment>
          ),
        )}
      </>
    );
  },
);

Rotator.displayName = "Rotator";
