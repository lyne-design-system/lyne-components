import type { Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import readme from './readme.md?raw';

import '../card.js';

const Template = (): TemplateResult => html`
  <sbb-card color="milk">
    'sbb-card-button' is an invisible action element. See 'sbb-card' examples to see it in action.
  </sbb-card>
`;

export const SbbCardButtonElement: StoryObj = {
  render: Template,
};

const meta: Meta = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-card/sbb-card-button',
};

export default meta;
