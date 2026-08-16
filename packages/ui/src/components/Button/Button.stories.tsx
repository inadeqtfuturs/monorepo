import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import Button from './index';

const meta = { component: Button } satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Defaults: Story = {
  args: { children: 'test' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('test');

    await expect(button).toBeInTheDocument();
  },
};
