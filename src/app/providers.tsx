'use client';

import { HeroUIProvider } from '@heroui/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <HeroUIProvider className='h-full w-full'>{children}</HeroUIProvider>;
};
