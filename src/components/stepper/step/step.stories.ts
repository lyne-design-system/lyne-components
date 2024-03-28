import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import readme from './readme.md?raw';
import './step';

const Template = (): TemplateResult => html`<sbb-step data-selected>Step content.</sbb-step>`;

export const Default: StoryObj = {
  render: Template,
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style="padding: 2rem;">${story()}</div> `,
    withActions as Decorator,
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-stepper/sbb-step',
};

export default meta;
