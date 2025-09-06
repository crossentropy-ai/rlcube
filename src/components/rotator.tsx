import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection } from "./consts";
import { RotationPanel } from "./rotation-panel";
import { Group } from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

type RotatorProps = {
  facingDirection: FacingDirection;
};

export const Rotator = ({ facingDirection }: RotatorProps) => {
  const { scene } = useThree();
  const { getCubes } = useCubesContext();
  const isRotating = useRef(false);
  const rotatingDirection = useRef<"clockwise" | "counter-clockwise">(
    "clockwise",
  );
  const rotatingGroup = useRef<Group>(new Group());

  useFrame((state, delta) => {
    if (!isRotating.current) return;

    const speed = 2;
    let sign = 0;
    switch (facingDirection) {
      case "front":
        sign = rotatingDirection.current === "clockwise" ? -1 : 1;
        rotatingGroup.current.rotation.z += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.z) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.z = (Math.PI / 2) * sign;
        }
        break;
      case "back":
        sign = rotatingDirection.current === "clockwise" ? 1 : -1;
        rotatingGroup.current.rotation.z += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.z) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.z = (Math.PI / 2) * sign;
        }
        break;
      case "left":
        sign = rotatingDirection.current === "clockwise" ? 1 : -1;
        rotatingGroup.current.rotation.x += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.x) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.x = (Math.PI / 2) * sign;
        }
        break;
      case "right":
        sign = rotatingDirection.current === "clockwise" ? -1 : 1;
        rotatingGroup.current.rotation.x += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.x) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.x = (Math.PI / 2) * sign;
        }
        break;
      case "top":
        sign = rotatingDirection.current === "clockwise" ? -1 : 1;
        rotatingGroup.current.rotation.y += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.y) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.y = (Math.PI / 2) * sign;
        }
        break;
      case "bottom":
        sign = rotatingDirection.current === "clockwise" ? 1 : -1;
        rotatingGroup.current.rotation.y += sign * delta * speed;
        if (Math.abs(rotatingGroup.current.rotation.y) > Math.PI / 2) {
          isRotating.current = false;
          rotatingGroup.current.rotation.y = (Math.PI / 2) * sign;
        }
        break;
    }

    if (!isRotating.current) {
      const children = [...rotatingGroup.current.children];
      children.forEach((child) => scene.attach(child));
      scene.remove(rotatingGroup.current);
    }
  });

  const handleClick = (direction: "clockwise" | "counter-clockwise") => {
    if (isRotating.current) return;
    const cubes = getCubes(facingDirection);

    rotatingGroup.current = new Group();
    scene.add(rotatingGroup.current);
    cubes.forEach((cube) => rotatingGroup.current.attach(cube));
    rotatingDirection.current = direction;
    isRotating.current = true;
  };

  return (
    <>
      <RotationPanel
        direction="clockwise"
        facingDirection={facingDirection}
        onClick={(_, direction) => handleClick(direction)}
      />
      <RotationPanel
        direction="counter-clockwise"
        facingDirection={facingDirection}
        onClick={(_, direction) => handleClick(direction)}
      />
    </>
  );
};
