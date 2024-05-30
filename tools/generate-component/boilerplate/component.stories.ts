import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, Decorator, Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread';

import readme from './readme.md?raw';
import { __nameUpperCase__ } from './__noPrefixName__';

const myProp: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  'my-prop': myProp,
};

const defaultArgs: Args = {
  'my-prop': 'Label',
};

const Template = (args: Args): TemplateResult => html`<__name__ ${sbbSpread(args)}></__name__>`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: [__nameUpperCase__.events.myEventName],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/__name__',
};

export default meta;
