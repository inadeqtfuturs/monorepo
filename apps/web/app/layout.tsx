import type { Metadata } from 'next';
import React from 'react';
import type { ReactNode } from 'react';

import Layout from '@/components/Layout';
import ThemeScript from '@/lib/getTheme';
import '@if/ui/styles.css';
import '@/theme/global.css';
import defaultMetadata from '@/lib/metadata';

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning data-scroll-behavior='smooth'>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
