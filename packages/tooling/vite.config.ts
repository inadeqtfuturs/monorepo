import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  const root = path.resolve(import.meta.dirname, '../..');
  dotenv.config({ path: `${import.meta.dirname}/../../.env` });

  return {
    resolve: {
      tsconfigPaths: true,
    },
    test: {
      globals: true,
      root,
      coverage: {
        // provider: 'v8',
        clean: true,
        reporter: ['text', 'html', 'clover', 'json', 'cobertura'],
      },
      environment: 'jsdom',
    },
  };
});
