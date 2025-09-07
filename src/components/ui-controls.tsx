'use client';

import { Button, ButtonGroup, Card, CardBody, Checkbox, Slider } from '@heroui/react';
import { useState } from 'react';

import { useControlContext } from '@/contexts/control-context';

import { Actions } from './consts';
import { rotationController } from './rotation-controller';

export const UIControls = () => {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const {
    rubiksCubeRef,
    showRotationIndicators,
    setShowRotationIndicators,
    setBackground,
    cubeRoughness,
    setCubeRoughness,
    cubeSpeed,
    setCubeSpeed,
  } = useControlContext();

  const scramble = () => {
    const scrambleSteps = Array.from({ length: 20 }, () => Actions[Math.floor(Math.random() * Actions.length)]);
    rubiksCubeRef?.current?.rotate(scrambleSteps);
  };

  const reset = () => {
    rubiksCubeRef?.current?.reset();
  };

  const showState = () => {
    const faces = rotationController.getFaces('front');
    console.log(faces);
  };

  const solve = () => {
    alert('Working on it!');
  };

  const train = () => {
    alert('Working on it!');
  };

  return (
    <div className="z-10 pointer-events-none">
      <Card className="max-w-sm bg-white/30 border border-white/80 backdrop-blur-xl pointer-events-auto">
        <CardBody className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">Controls</div>
            <Button variant="light" size="sm" onPress={() => setIsControlsOpen(!isControlsOpen)}>
              {isControlsOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
          <div
            className={`
              flex flex-col gap-6 transition-all duration-500 ease-in-out
              ${isControlsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
              overflow-hidden
            `}
            style={{ willChange: 'max-height, opacity' }}
          >
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm">Rotation Indicators</div>
                <Checkbox isSelected={showRotationIndicators} onValueChange={setShowRotationIndicators} />
              </div>
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
                <ButtonGroup size="sm">
                  <Button onPress={scramble}>Scramble</Button>
                  <Button onPress={reset}>Reset</Button>
                </ButtonGroup>

                <Button size="sm" variant="light" onPress={showState}>
                  Show State
                </Button>

                <Button size="sm" className="ms-auto" color="success" onPress={solve}>
                  Solve
                </Button>
              </div>
              <div className="text-sm italic font-bold underline text-primary cursor-pointer" onClick={train}>
                Train your own model!
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
