'use client';

import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { useDisclosure } from '@heroui/use-disclosure';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Index2Color } from './consts';
import { rotationController } from './rotation-controller';

export type StateModalRef = {
  open: (state: Array<Array<number>>) => void;
};

export const StateModal = forwardRef<StateModalRef, unknown>((_, ref) => {
  const [state, setState] = useState<Array<Array<number>>>([]);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    open: (state: Array<Array<number>>) => {
      setState(state);
      onOpen();
    },
  }));

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(state));
  };

  const solve = async () => {
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      if (!response.ok) {
        throw new Error('Server error', { cause: response });
      }
      const { steps } = await response.json();
      rotationController.addRotationStepCode(...steps);
      onClose();
    } catch (err) {
      alert('An error occurred. Check the console for details.');
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>State</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Front</div>
                  <div className="font-mono">{JSON.stringify(state[0])}</div>
                  <div className="font-mono">[{state[0].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Back</div>
                  <div className="font-mono">{JSON.stringify(state[1])}</div>
                  <div className="font-mono">[{state[1].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Right</div>
                  <div className="font-mono">{JSON.stringify(state[2])}</div>
                  <div className="font-mono">[{state[2].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Left</div>
                  <div className="font-mono">{JSON.stringify(state[3])}</div>
                  <div className="font-mono">[{state[3].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Up</div>
                  <div className="font-mono">{JSON.stringify(state[4])}</div>
                  <div className="font-mono">[{state[4].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm w-24 font-mont">Down</div>
                  <div className="font-mono">{JSON.stringify(state[5])}</div>
                  <div className="font-mono">[{state[5].map((index) => Index2Color[index]).join(', ')}]</div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" size="sm" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" variant="light" size="sm" onPress={copy}>
                Copy
              </Button>
              <Button color="success" size="sm" onPress={solve}>
                Solve
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

StateModal.displayName = 'StateModal';
