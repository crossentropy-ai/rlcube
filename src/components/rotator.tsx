import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection } from "./consts";
import { RotationPanel } from "./rotation-panel";
import { Group } from "three";
import { Fragment, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

type RotateArgs = {
  rotatingFaceDirection: FacingDirection;
  rotatingDirection: "clockwise" | "counter-clockwise";
  rotatingGroup: Group;
};

export const Rotator = () => {
  const { scene } = useThree();
  const { getCubes } = useCubesContext();
  const isRotating = useRef(false);
  const rotateArgs = useRef<RotateArgs>({
    rotatingFaceDirection: "front",
    rotatingDirection: "clockwise",
    rotatingGroup: new Group(),
  });

  useFrame((state, delta) => {
    const { rotatingFaceDirection, rotatingDirection, rotatingGroup } =
      rotateArgs.current;
    if (!isRotating.current) return;

    const speed = 2;
    let sign = 0;
    switch (rotatingFaceDirection) {
      case "front":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.z += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
          rotatingGroup.rotation.z = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "back":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.z += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.z) > Math.PI / 2) {
          rotatingGroup.rotation.z = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "left":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.x += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
          rotatingGroup.rotation.x = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "right":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.x += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.x) > Math.PI / 2) {
          rotatingGroup.rotation.x = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "top":
        sign = rotatingDirection === "clockwise" ? -1 : 1;
        rotatingGroup.rotation.y += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
          rotatingGroup.rotation.y = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
      case "bottom":
        sign = rotatingDirection === "clockwise" ? 1 : -1;
        rotatingGroup.rotation.y += sign * delta * speed;
        if (Math.abs(rotatingGroup.rotation.y) > Math.PI / 2) {
          rotatingGroup.rotation.y = (Math.PI / 2) * sign;
          isRotating.current = false;
        }
        break;
    }

    if (isRotating.current) return;
    const children = [...rotatingGroup.children];
    children.forEach((child) => scene.attach(child));
    scene.remove(rotatingGroup);
  });

  const handleClick = (
    facingDirection: FacingDirection,
    direction: "clockwise" | "counter-clockwise",
  ) => {
    if (isRotating.current) return;
    const cubes = getCubes(facingDirection);

    rotateArgs.current.rotatingFaceDirection = facingDirection;
    rotateArgs.current.rotatingDirection = direction;
    rotateArgs.current.rotatingGroup = new Group();
    scene.add(rotateArgs.current.rotatingGroup);
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
