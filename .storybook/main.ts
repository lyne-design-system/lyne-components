import type { StorybookConfig } from '@storybook/web-components-vite';
import { type UserConfig, mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, <UserConfig>{
      assetsInclude: ['src/**/*.md'],
    });
  },
};
export default config;
