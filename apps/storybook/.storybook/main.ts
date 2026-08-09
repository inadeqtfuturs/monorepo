import type { StorybookConfig } from '@storybook/nextjs';
import { join, dirname } from 'node:path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): unknown {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/poptoast/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs') as string,
    options: {
      nextConfigPath: '../../web/next.config.js',
    },
  },
};
export default config;
