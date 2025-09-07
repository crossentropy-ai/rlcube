export type FacingDirection =
  | "front"
  | "back"
  | "left"
  | "right"
  | "top"
  | "bottom";

export type RotationDirection = "clockwise" | "counter-clockwise";

export const Rotations: Record<FacingDirection, [number, number, number]> = {
  front: [0, 0, 0],
  back: [0, Math.PI, 0],
  left: [0, -Math.PI / 2, 0],
  right: [0, Math.PI / 2, 0],
  top: [-Math.PI / 2, 0, 0],
  bottom: [Math.PI / 2, 0, 0],
};

export type RotationStep = {
  faceDirection: FacingDirection;
  direction: RotationDirection;
};

export const Actions: Array<RotationStep> = [
  { faceDirection: "front", direction: "clockwise" },
  { faceDirection: "front", direction: "counter-clockwise" },
  { faceDirection: "right", direction: "clockwise" },
  { faceDirection: "right", direction: "counter-clockwise" },
  { faceDirection: "left", direction: "clockwise" },
  { faceDirection: "left", direction: "counter-clockwise" },
  { faceDirection: "back", direction: "clockwise" },
  { faceDirection: "back", direction: "counter-clockwise" },
  { faceDirection: "top", direction: "clockwise" },
  { faceDirection: "top", direction: "counter-clockwise" },
  { faceDirection: "bottom", direction: "clockwise" },
  { faceDirection: "bottom", direction: "counter-clockwise" },
];
