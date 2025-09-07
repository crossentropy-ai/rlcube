'use client';

import { HeroUIProvider } from '@heroui/system';

import { ControlProvider } from '@/contexts/control-context';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider className="h-full w-full">
      <ControlProvider>{children}</ControlProvider>
    </HeroUIProvider>
  );
};
