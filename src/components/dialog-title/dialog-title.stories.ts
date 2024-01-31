import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

import { sbbSpread } from '../core/dom';

import readme from './readme.md?raw';

import './dialog-title';

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  'title-content': titleContent,
};

const defaultArgs: Args = {
  'title-content': 'Title content',
};

const Template = (args: Args): TemplateResult =>
  html`<sbb-dialog-title ${sbbSpread(args)}>Dialog title</sbb-dialog-title>`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
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
  title: 'components/sbb-dialog/sbb-dialog-title',
};

export default meta;
