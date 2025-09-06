"use client";

import { FacingDirection } from "@/components/consts";
import { createContext, RefObject, useContext, useRef } from "react";
import { Mesh } from "three";

export type CubeMeshRef = RefObject<Mesh | null>;

type CubesContextType = {
  addCube: (cubeMeshRef: CubeMeshRef) => void;
  getCubes: (faceDirection: FacingDirection) => Mesh[];
};

const CubesContext = createContext<CubesContextType>({
  addCube: () => {},
  getCubes: () => [],
});

export const useCubesContext = () => useContext(CubesContext);

export const CubesProvider = ({ children }: { children: React.ReactNode }) => {
  const cubes = useRef<CubeMeshRef[]>([]);

  const addCube = (cubeMeshRef: CubeMeshRef) => {
    if (!cubes.current.includes(cubeMeshRef)) {
      cubes.current.push(cubeMeshRef);
    }
  };

  const getCubes = (faceDirection: FacingDirection) => {
    const meshes = cubes.current
      .map((c) => c.current)
      .filter((m) => m !== null);
    switch (faceDirection) {
      case "front":
        return meshes.filter((m) => m.position.z > 0);
      case "back":
        return meshes.filter((m) => m.position.z < 0);
      case "left":
        return meshes.filter((m) => m.position.x < 0);
      case "right":
        return meshes.filter((m) => m.position.x > 0);
      case "top":
        return meshes.filter((m) => m.position.y > 0);
      case "bottom":
        return meshes.filter((m) => m.position.y < 0);
    }
  };

  return (
    <CubesContext.Provider value={{ addCube, getCubes }}>
      {children}
    </CubesContext.Provider>
  );
};
