import { Canvas } from "@/components/canvas";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full p-6">
          <div className="text-6xl font-bold">Rubik&apos;s Cube Solver</div>
          <div className="text-2xl text-gray-800">
            with Reinforcement Learning
          </div>
          <div className="text-gray-700">
            <a href="https://cross-entropy.ai">
              https://cross-entropy.ai
            </a>
          </div>
        </div>
      </div>
      <Canvas />
    </div>
  );
}
