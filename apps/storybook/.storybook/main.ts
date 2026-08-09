import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/poptoast/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@chromatic-com/storybook'],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../../web/next.config.js',
    },
  },
};
export default config;
