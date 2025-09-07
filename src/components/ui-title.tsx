export const UITitle = () => {
  return (
    <div className="z-10 pointer-events-none">
      <div className="pointer-events-auto w-fit">
        <div className="text-6xl font-bold">Rubik&apos;s Cube Solver</div>
        <div className="text-2xl text-gray-800">with Reinforcement Learning</div>
        <div className="text-gray-700">
          <a href="https://cross-entropy.ai" target="_blank" className="underline text-primary font-bold">
            https://cross-entropy.ai
          </a>
        </div>
      </div>
    </div>
  );
};
