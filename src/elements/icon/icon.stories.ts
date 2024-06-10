import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './icon.js';

const Template = (args: Args): TemplateResult => html`<sbb-icon ${sbbSpread(args)}></sbb-icon>`;

const iconName: InputType = {
  control: {
    type: 'select',
  },
  options: [
    'app-icon-medium',
    'train-medium',
    'swisspass-medium',
    'pie-medium',
    'chevron-small-left-small',
  ],
};

const defaultArgTypes: ArgTypes = {
  name: iconName,
};

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    name: iconName.options![0],
  },
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-icon',
};

export default meta;
