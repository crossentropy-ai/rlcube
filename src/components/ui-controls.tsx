'use client';

import { Button, ButtonGroup, Card, CardBody, Slider } from '@heroui/react';

import { useControlContext } from '@/contexts/control-context';

import { Actions } from './consts';

export const UIControls = () => {
  const { rubiksCubeRef, setBackground, cubeRoughness, setCubeRoughness, cubeSpeed, setCubeSpeed } =
    useControlContext();

  const scramble = () => {
    const scrambleSteps = Array.from({ length: 20 }, () => Actions[Math.floor(Math.random() * Actions.length)]);
    rubiksCubeRef?.current?.rotate(scrambleSteps);
  };

  return (
    <div className="z-10 pointer-events-none">
      <Card className="max-w-sm bg-white/30 border border-white/80 backdrop-blur-xl pointer-events-auto">
        <CardBody className="flex flex-col gap-6">
          <div className="text-2xl font-bold">Controls</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">Background</div>
              <ButtonGroup size="sm">
                <Button onPress={() => setBackground('sunset')}>Sunset</Button>
                <Button onPress={() => setBackground('dawn')}>Dawn</Button>
                <Button onPress={() => setBackground('forest')}>Forest</Button>
              </ButtonGroup>
            </div>
            <Slider
              size="sm"
              label="Cube Roughness"
              value={cubeRoughness}
              onChange={(value) => setCubeRoughness(value as number)}
              minValue={0.2}
              maxValue={1}
              step={0.01}
            />
            <Slider
              size="sm"
              label="Cube Speed"
              value={cubeSpeed}
              onChange={(value) => setCubeSpeed(value as number)}
              minValue={1}
              maxValue={10}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button onPress={scramble}>Scramble</Button>
              <Button>Reset</Button>
              <Button className="ms-auto" color="success">
                Solve
              </Button>
            </div>
            <div className="text-sm italic font-bold underline text-primary cursor-pointer">Train my own model!</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
