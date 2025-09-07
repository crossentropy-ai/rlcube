import { Group, Mesh } from 'three';

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

  static getInstance() {
    if (!RotationController.instance) {
      RotationController.instance = new RotationController();
    }
    return RotationController.instance;
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
      case 'left':
        return this.cubes.filter((m) => m.position.x < 0);
      case 'right':
        return this.cubes.filter((m) => m.position.x > 0);
      case 'top':
        return this.cubes.filter((m) => m.position.y > 0);
      case 'bottom':
        return this.cubes.filter((m) => m.position.y < 0);
    }
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
