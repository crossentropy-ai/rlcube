import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection } from "./consts";
import { RotationPanel } from "./rotation-panel";
import { Group } from "three";
import { Fragment, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

type RotateArgs = {
  rotatingFaceDirection: FacingDirection;
  rotatingDirection: "clockwise" | "counter-clockwise";
  rotatingGroup: Group;
};

type RotatorProps = {
  cubeSpeed: number;
};

export const Rotator = ({ cubeSpeed }: RotatorProps) => {
  const { getCubes, cubeGroupRef } = useCubesContext();
  const isRotating = useRef(false);
  const rotateArgs = useRef<RotateArgs>({
    rotatingFaceDirection: "front",
    rotatingDirection: "clockwise",
    rotatingGroup: new Group(),
  });

  useFrame((state, delta) => {
    const { rotatingFaceDirection, rotatingDirection, rotatingGroup } =
      rotateArgs.current;
    const cubeGroup = cubeGroupRef.current;
    if (!isRotating.current || !cubeGroup) return;

    let sign = 0;
    switch (rotatingFaceDirection) {
      case "front":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.z += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
          rotatingGroup.rotation.z = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "back":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.z += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
          rotatingGroup.rotation.z = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "left":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.x += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
          rotatingGroup.rotation.x = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "right":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.x += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
          rotatingGroup.rotation.x = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "top":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.y += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
          rotatingGroup.rotation.y = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "bottom":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.y += sign * delta * cubeSpeed;
        if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
          rotatingGroup.rotation.y = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
    }

    if (isRotating.current) return;
    const children = [...rotatingGroup.children];
    children.forEach((child) => cubeGroup.attach(child));
    cubeGroup.remove(rotatingGroup);
  });

  const handleClick = (
    facingDirection: FacingDirection,
    direction: "clockwise" | "counter-clockwise",
  ) => {
    if (isRotating.current || !cubeGroupRef.current) return;
    const cubes = getCubes(facingDirection);

    rotateArgs.current.rotatingFaceDirection = facingDirection;
    rotateArgs.current.rotatingDirection = direction;
    rotateArgs.current.rotatingGroup = new Group();
    cubeGroupRef.current.add(rotateArgs.current.rotatingGroup);
    cubes.forEach((cube) => rotateArgs.current.rotatingGroup.attach(cube));

    isRotating.current = true;
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
};
