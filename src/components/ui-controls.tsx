'use client';

import { Button, ButtonGroup, Card, CardBody, Slider } from '@heroui/react';

export const UIControls = () => {
  return (
    <div className="z-10 pointer-events-none">
      <Card className="max-w-sm bg-white/30 border border-white/80 backdrop-blur-xl pointer-events-auto">
        <CardBody className="flex flex-col gap-6">
          <div className="text-2xl font-bold">Controls</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">Background</div>
              <ButtonGroup size="sm">
                <Button>Sunset</Button>
                <Button>Dawn</Button>
                <Button>Forest</Button>
              </ButtonGroup>
            </div>
            <Slider size="sm" label="Cube Roughness" defaultValue={0.5} minValue={0} maxValue={1} step={0.1} />
            <Slider size="sm" label="Cube Speed" defaultValue={2} minValue={1} maxValue={10} step={1} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button>Scramble</Button>
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
