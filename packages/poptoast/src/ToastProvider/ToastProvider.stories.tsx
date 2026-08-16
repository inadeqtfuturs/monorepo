import type { Meta, StoryObj } from '@storybook/react';

import ToastProvider from './index';

const meta = {
  title: 'poptoast/provider',
  component: ToastProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Defaults: Story = {};
