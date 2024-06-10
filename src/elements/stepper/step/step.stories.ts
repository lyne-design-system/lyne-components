import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import readme from './readme.md?raw';
import './step.js';

const Template = (): TemplateResult =>
  html`<sbb-step slot="step" data-selected>Step content.</sbb-step>`;

export const Default: StoryObj = {
  render: Template,
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-stepper/sbb-step',
};

export default meta;
