import { withActions } from '@storybook/addon-actions/decorator';
import type { Decorator, Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import './dialog-actions';
import readme from './readme.md?raw';

import '../button';
import '../link';

const Template = (): TemplateResult =>
  html`<sbb-dialog-actions align-group="stretch" orientation="vertical" horizontal-from="medium">
    <sbb-link
      align-self="start"
      icon-name="chevron-small-left-small"
      href="https://www.sbb.ch/en/"
      sbb-dialog-close
    >
      Link
    </sbb-link>
    <sbb-button variant="secondary" sbb-dialog-close> Cancel </sbb-button>
    <sbb-button variant="primary" sbb-dialog-close> Confirm </sbb-button>
  </sbb-dialog-actions>`;

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
  title: 'components/sbb-dialog/sbb-dialog-actions',
};

export default meta;
