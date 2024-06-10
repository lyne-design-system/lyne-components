import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import './dialog-content.js';
import readme from './readme.md?raw';

const Template = (): TemplateResult =>
  html`<sbb-dialog-content>This is a dialog content.</sbb-dialog-content>`;

export const Default: StoryObj = { render: Template };

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-dialog/sbb-dialog-content',
};

export default meta;
