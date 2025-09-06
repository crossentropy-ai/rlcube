import { useCubesContext } from "@/contexts/cubes-context";
import { FacingDirection } from "./consts";
import { RotationPanel } from "./rotation-panel";

type RotatorProps = {
  facingDirection: FacingDirection;
};

export const Rotator = ({ facingDirection }: RotatorProps) => {
  const { getCubes } = useCubesContext();

  const handleClick = (direction: "clockwise" | "counter-clockwise") => {
    const cubes = getCubes(facingDirection);
    cubes.forEach((cube) => {
      console.log(cube.position);
    });
    console.log(cubes.length, direction);
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
