import type { Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import readme from './readme.md?raw';

import '../card.js';

const Template = (): TemplateResult => html`
  <sbb-card color="milk">
    'sbb-card-link' is an invisible action element. See 'sbb-card' examples to see it in action.
  </sbb-card>
`;

export const SbbCardLinkElement: StoryObj = {
  render: Template,
};

const meta: Meta = {
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-card/sbb-card-link',
};

export default meta;
