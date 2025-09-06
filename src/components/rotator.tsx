import { FacingDirection } from "./consts";
import { RotationPanel } from "./rotation-panel";

type RotatorProps = {
  facingDirection: FacingDirection;
};

export const Rotator = ({ facingDirection }: RotatorProps) => {
  return (
    <>
      <RotationPanel direction="clockwise" facingDirection={facingDirection} />
      <RotationPanel
        direction="counter-clockwise"
        facingDirection={facingDirection}
      />
    </>
  );
};
