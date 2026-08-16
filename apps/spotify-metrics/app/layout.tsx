import type { ReactNode } from 'react';
import React from 'react';

import '@if/ui/styles.css';
import defaultMetadata from '@/lib/metadata';

export const metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>📻</text></svg>'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
