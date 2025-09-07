import type { Metadata } from 'next';

import { Providers } from '@/app/providers';

import './globals.css';

export const metadata: Metadata = {
  title: "Rubik's Cube Solver - with Reinforcement Learning",
  description: "A web application for solving Rubik's Cube using Reinforcement Learning techniques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
