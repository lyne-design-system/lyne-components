import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import './dialog-actions.js';
import readme from './readme.md?raw';

import '../../button/button.js';
import '../../button/secondary-button.js';
import '../../link.js';

const Template = (): TemplateResult =>
  html`<sbb-dialog-actions align-group="stretch" orientation="vertical" horizontal-from="medium">
    <sbb-block-link
      align-self="start"
      icon-name="chevron-small-left-small"
      href="https://www.sbb.ch/en/"
      sbb-dialog-close
    >
      Link
    </sbb-block-link>
    <sbb-secondary-button sbb-dialog-close> Cancel </sbb-secondary-button>
    <sbb-button sbb-dialog-close> Confirm </sbb-button>
  </sbb-dialog-actions>`;

export const Default: StoryObj = { render: Template };

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-dialog/sbb-dialog-actions',
};

export default meta;
