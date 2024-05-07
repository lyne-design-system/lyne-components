import type { Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import readme from './readme.md?raw';
import './badge.js';
import '../icon.js';

const Template = (): TemplateResult => html`
  <sbb-badge label="2"><sbb-icon name="arrow-right-small"></sbb-icon></sbb-badge>
`;

export const Badge: StoryObj = {
  render: Template,
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-badge',
};

export default meta;
