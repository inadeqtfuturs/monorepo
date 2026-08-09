import { composeStories } from '@storybook/nextjs';
import { describe, it } from 'vitest';
import * as stories from '../Button.stories';

const { Defaults } = composeStories(stories);

describe('Button', () => {
  it('renders button', async () => {
    await Defaults.run();
  });
});
