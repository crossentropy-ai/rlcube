import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection } from "./consts";
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

type RotateArgs = {
  rotatingFaceDirection: FacingDirection;
  rotatingDirection: "clockwise" | "counter-clockwise";
  rotatingGroup: Group;
};

export type RotatorRef = {
  rotate: (
    steps: Array<{
      faceDirection: FacingDirection;
      direction: "clockwise" | "counter-clockwise";
    }>,
  ) => void;
};

type RotatorProps = {
  cubeSpeed: number;
};

export const Rotator = forwardRef<RotatorRef, RotatorProps>(
  ({ cubeSpeed }: RotatorProps, ref) => {
    const { getCubes, cubeGroupRef } = useCubesContext();
    const rotationSteps = useRef<
      Array<{
        faceDirection: FacingDirection;
        direction: "clockwise" | "counter-clockwise";
      }>
    >([]);

    useImperativeHandle(ref, () => ({
      rotate: (
        steps: Array<{
          faceDirection: FacingDirection;
          direction: "clockwise" | "counter-clockwise";
        }>,
      ) => {
        steps.forEach((step) => {
          rotationSteps.current.push(step);
        });
      },
    }));

    const rotate = (
      rotatingFaceDirection: FacingDirection,
      rotatingDirection: "clockwise" | "counter-clockwise",
      rotatingGroup: Group,
      delta: number,
    ) => {
      let sign = 0;
      switch (rotatingFaceDirection) {
        case "front":
          sign = rotatingDirection === "clockwise" ? -1 : 1;
          rotatingGroup.rotation.z += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
            rotatingGroup.rotation.z = (Math.PI / 2) * sign;
            return true;
          }
          return false;
        case "back":
          sign = rotatingDirection === "clockwise" ? 1 : -1;
          rotatingGroup.rotation.z += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
            rotatingGroup.rotation.z = (Math.PI / 2) * sign;
            return true;
          }
          return false;
        case "left":
          sign = rotatingDirection === "clockwise" ? 1 : -1;
          rotatingGroup.rotation.x += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
            rotatingGroup.rotation.x = (Math.PI / 2) * sign;
            return true;
          }
          return false;
        case "right":
          sign = rotatingDirection === "clockwise" ? -1 : 1;
          rotatingGroup.rotation.x += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
            rotatingGroup.rotation.x = (Math.PI / 2) * sign;
            return true;
          }
          return false;
        case "top":
          sign = rotatingDirection === "clockwise" ? -1 : 1;
          rotatingGroup.rotation.y += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
            rotatingGroup.rotation.y = (Math.PI / 2) * sign;
            return true;
          }
          return false;
        case "bottom":
          sign = rotatingDirection === "clockwise" ? 1 : -1;
          rotatingGroup.rotation.y += sign * delta * cubeSpeed;
          if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
            rotatingGroup.rotation.y = (Math.PI / 2) * sign;
            return true;
          }
          return false;
      }
    };

    const frameCallback = useMemo(() => {
      let rotationStep: {
        faceDirection: FacingDirection;
        direction: "clockwise" | "counter-clockwise";
      } | null = null;
      let rotatingGroup = new Group();

      const beforeRotationStep = (step: {
        faceDirection: FacingDirection;
        direction: "clockwise" | "counter-clockwise";
      }) => {
        const cubes = getCubes(step.faceDirection);
        rotationStep = step;
        rotatingGroup = new Group();
        cubeGroupRef.current?.add(rotatingGroup);
        cubes.forEach((cube) => rotatingGroup.attach(cube));
      };
      const afterRotationStep = () => {
        rotationStep = null;
        const children = [...rotatingGroup.children];
        children.forEach((child) => cubeGroupRef.current?.attach(child));
        cubeGroupRef.current?.remove(rotatingGroup);
      };

      return (state: unknown, delta: number) => {
        if (!cubeGroupRef.current) return;
        if (rotationSteps.current.length === 0 && !rotationStep) return;
        if (!rotationStep) {
          const step = rotationSteps.current.shift();
          if (!step) return;
          beforeRotationStep(step);
        }

        const done = rotate(
          rotationStep?.faceDirection!,
          rotationStep?.direction!,
          rotatingGroup,
          delta,
        );
        if (done) afterRotationStep();
      };
    }, []);

    useFrame(frameCallback);

    const handleClick = (
      facingDirection: FacingDirection,
      direction: "clockwise" | "counter-clockwise",
    ) => {
      rotationSteps.current.push({ faceDirection: facingDirection, direction });
    };

    return (
      <>
        {["front", "back", "left", "right", "top", "bottom"].map(
          (facingDirection) => (
            <Fragment key={facingDirection}>
              <RotationPanel
                direction="clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={handleClick}
              />
              <RotationPanel
                direction="counter-clockwise"
                facingDirection={facingDirection as FacingDirection}
                onClick={handleClick}
              />
            </Fragment>
          ),
        )}
      </>
    );
  },
);

Rotator.displayName = "Rotator";
