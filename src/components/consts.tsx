export type FacingDirection = 'front' | 'back' | 'right' | 'left' | 'up' | 'down';

export type RotationDirection = 'clockwise' | 'counter-clockwise';

export const CubeColors: Record<FacingDirection, string> = {
  front: '#ff0000', // Red
  back: '#ff00ff', // Purple
  right: '#0000ff', // Blue
  left: '#00ff00', // Green
  up: '#ffff00', // Yellow
  down: '#ffffff', // White
};

export const Color2Index: Record<string, number> = {
  '#ff0000': 0,
  '#ff00ff': 1,
  '#0000ff': 2,
  '#00ff00': 3,
  '#ffff00': 4,
  '#ffffff': 5,
};

export const Index2Color: Record<number, string> = {
  0: 'R',
  1: 'P',
  2: 'B',
  3: 'G',
  4: 'Y',
  5: 'W',
};

export const Rotations: Record<FacingDirection, [number, number, number]> = {
  front: [0, 0, 0],
  back: [0, Math.PI, 0],
  right: [0, Math.PI / 2, 0],
  left: [0, -Math.PI / 2, 0],
  up: [-Math.PI / 2, 0, 0],
  down: [Math.PI / 2, 0, 0],
};

export type RotationStep = {
  faceDirection: FacingDirection;
  direction: RotationDirection;
};

export const Actions: Array<RotationStep> = [
  { faceDirection: 'front', direction: 'clockwise' },
  { faceDirection: 'front', direction: 'counter-clockwise' },
  { faceDirection: 'back', direction: 'clockwise' },
  { faceDirection: 'back', direction: 'counter-clockwise' },
  { faceDirection: 'right', direction: 'clockwise' },
  { faceDirection: 'right', direction: 'counter-clockwise' },
  { faceDirection: 'left', direction: 'clockwise' },
  { faceDirection: 'left', direction: 'counter-clockwise' },
  { faceDirection: 'up', direction: 'clockwise' },
  { faceDirection: 'up', direction: 'counter-clockwise' },
  { faceDirection: 'down', direction: 'clockwise' },
  { faceDirection: 'down', direction: 'counter-clockwise' },
];
