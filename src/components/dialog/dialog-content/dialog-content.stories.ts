import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import './dialog-content';
import readme from './readme.md?raw';

const Template = (): TemplateResult =>
  html`<sbb-dialog-content>This is a dialog content.</sbb-dialog-content>`;

export const Default: StoryObj = { render: Template };

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
  title: 'components/sbb-dialog/sbb-dialog-content',
};

export default meta;
