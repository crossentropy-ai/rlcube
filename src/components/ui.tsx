import { UIControls } from './ui-controls';
import { UITitle } from './ui-title';

export const UI = () => {
  return (
    <div className="absolute inset-0">
      <div className="w-full h-full p-6 flex flex-col justify-between">
        <UITitle />
        <UIControls />
      </div>
    </div>
  );
};
