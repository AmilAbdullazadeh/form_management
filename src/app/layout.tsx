import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { ModalProvider } from '@/components/common';
import { Providers } from '@/lib/redux/provider';

import '@/styles/variables.css';
import '@/styles/globals.css';
import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Form Management',
  description: 'A simple form management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ModalProvider>
            {children}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
} 