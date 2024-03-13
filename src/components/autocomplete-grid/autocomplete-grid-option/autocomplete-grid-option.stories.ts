import type { Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import readme from './readme.md?raw';

const Template = (): TemplateResult => html`See 'sbb-autocomplete-grid' for demonstration.`;

export const Default: StoryObj = {
  render: Template,
};

const meta: Meta = {
  decorators: [(story) => html` <div style="padding: 2rem;">${story()}</div> `],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-autocomplete-grid/sbb-autocomplete-grid-option',
};

export default meta;
