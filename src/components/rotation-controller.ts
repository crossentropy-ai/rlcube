import { Group, Mesh, Vector3 } from 'three';

import { FacingDirection, RotationStep } from './consts';

export class RotationController {
  private static instance: RotationController;

  private cubeGroup?: Group;
  private cubes: Array<Mesh>;
  private cubeSpeed: number;
  private rotationSteps: Array<RotationStep>;
  private rotatingStep: RotationStep | null;
  private rotatingGroup: Group;

  constructor() {
    this.cubes = [];
    this.cubeSpeed = 2;
    this.rotationSteps = [];
    this.rotatingStep = null;
    this.rotatingGroup = new Group();
  }

  private rotate(step: RotationStep, group: Group, delta: number) {
    let sign = 0;
    let axis: 'x' | 'y' | 'z' = 'x';
    switch (step.faceDirection) {
      case 'front':
        sign = step.direction === 'clockwise' ? -1 : 1;
        axis = 'z';
        break;
      case 'back':
        sign = step.direction === 'clockwise' ? 1 : -1;
        axis = 'z';
        break;
      case 'left':
        sign = step.direction === 'clockwise' ? 1 : -1;
        axis = 'x';
        break;
      case 'right':
        sign = step.direction === 'clockwise' ? -1 : 1;
        axis = 'x';
        break;
      case 'top':
        sign = step.direction === 'clockwise' ? -1 : 1;
        axis = 'y';
        break;
      case 'bottom':
        sign = step.direction === 'clockwise' ? 1 : -1;
        axis = 'y';
        break;
    }

    group.rotation[axis] += sign * delta * this.cubeSpeed;
    if (Math.abs(group.rotation[axis]) > Math.PI / 2) {
      group.rotation[axis] = (Math.PI / 2) * sign;
      return true;
    }
    return false;
  }

  private getCubeFaceData(mesh: Mesh, faceDirection: FacingDirection) {
    const faces = mesh.children.filter((child) => child.userData.isFace);
    let axis: 'x' | 'y' | 'z' = 'x';
    switch (faceDirection) {
      case 'front':
      case 'back':
        axis = 'z';
        break;
      case 'right':
      case 'left':
        axis = 'x';
        break;
      case 'top':
      case 'bottom':
        axis = 'y';
        break;
    }
    let maxFace: Mesh | null = null;
    let maxValue = -Infinity;
    for (const face of faces) {
      const worldPosition = new Vector3();
      face.getWorldPosition(worldPosition);
      const axisValue = Math.abs(worldPosition[axis]);
      if (axisValue > maxValue) {
        maxValue = axisValue;
        maxFace = face as Mesh;
      }
    }
    if (!maxFace) return { colorIndex: -1, worldPosition: new Vector3(), rank: Infinity }; // this should never happen
    const worldPosition = new Vector3();
    maxFace.getWorldPosition(worldPosition);
    const axis2 = ['x', 'y', 'z'].filter((x) => x !== axis) as Array<'x' | 'y' | 'z'>;
    const rank = worldPosition[axis2[0]] * 100 + worldPosition[axis2[1]] * 10;
    return {
      colorIndex: maxFace.userData.faceColorIndex,
      worldPosition: worldPosition,
      rank: rank,
    };
  }

  static getInstance() {
    if (!RotationController.instance) {
      RotationController.instance = new RotationController();
    }
    return RotationController.instance;
  }

  stopRotation(cb: () => void) {
    this.rotationSteps = [];
    const cancel = setInterval(() => {
      if (!this.rotatingStep) {
        clearInterval(cancel);
        cb();
      }
    }, 50);
  }

  setCubeGroup(cubeGroup: Group) {
    this.cubeGroup = cubeGroup;
  }

  addCube(cube: Mesh) {
    if (!this.cubes.includes(cube)) {
      this.cubes.push(cube);
    }
  }

  getCubes(faceDirection: FacingDirection) {
    switch (faceDirection) {
      case 'front':
        return this.cubes.filter((m) => m.position.z > 0);
      case 'back':
        return this.cubes.filter((m) => m.position.z < 0);
      case 'right':
        return this.cubes.filter((m) => m.position.x > 0);
      case 'left':
        return this.cubes.filter((m) => m.position.x < 0);
      case 'top':
        return this.cubes.filter((m) => m.position.y > 0);
      case 'bottom':
        return this.cubes.filter((m) => m.position.y < 0);
    }
  }

  getStatus() {
    return ['front', 'back', 'right', 'left', 'top', 'bottom'].map((f) => {
      const faceDirection = f as FacingDirection;
      const cubes = this.getCubes(faceDirection);
      const indices = cubes.map((cube) => this.getCubeFaceData(cube, faceDirection)).sort((a, b) => a.rank - b.rank);
      return indices.map((i) => i.colorIndex);
    });
  }

  setCubeSpeed(cubeSpeed: number) {
    this.cubeSpeed = cubeSpeed;
  }

  addRotationStep(...step: Array<RotationStep>) {
    this.rotationSteps.push(...step);
  }

  frameCallback(state: unknown, delta: number) {
    if (!this.cubeGroup) return;
    if (this.rotationSteps.length === 0 && !this.rotatingStep) return;
    if (!this.rotatingStep) {
      const step = this.rotationSteps.shift();
      if (!step) return;
      this.rotatingStep = step;
      const cubes = this.getCubes(step.faceDirection);
      this.rotatingGroup = new Group();
      this.cubeGroup?.add(this.rotatingGroup);
      cubes.forEach((cube) => this.rotatingGroup.attach(cube));
    }

    const done = this.rotate(this.rotatingStep, this.rotatingGroup, delta);
    if (done) {
      this.rotatingStep = null;
      const children = [...this.rotatingGroup.children];
      children.forEach((child) => this.cubeGroup?.attach(child));
      this.cubeGroup?.remove(this.rotatingGroup);
    }
  }
}

export const rotationController = RotationController.getInstance();
export const frameCallback = rotationController.frameCallback.bind(rotationController);
