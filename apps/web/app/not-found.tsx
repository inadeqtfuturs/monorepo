import type { Metadata } from 'next';
import React from 'react';
import Generative from '@/components/Generative';
import defaultMetadata from '@/lib/metadata';

export const metadata: Metadata = defaultMetadata({
  title: '404',
});

async function NotFound() {
  return (
    <main className='not-found'>
      <Generative />
      <h1>404</h1>
      <p>
        you're trying to find something that doesn't exist (at least, not here)
      </p>
      <p>
        the above image is generative art made with canvas apis. you can refresh
        this page to generate a new object
      </p>
    </main>
  );
}

export default NotFound;
