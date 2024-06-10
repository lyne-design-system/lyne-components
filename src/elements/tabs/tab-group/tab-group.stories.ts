import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type {
  Meta,
  StoryObj,
  ArgTypes,
  Args,
  Decorator,
  StoryContext,
} from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import { SbbTabGroupElement } from './tab-group.js';

import '../../link.js';
import '../../title.js';
import '../tab-title.js';

const firstTabTitle = (label: string, args: Args): TemplateResult => html`
  <sbb-tab-title ${sbbSpread(args)}>${label}</sbb-tab-title>
`;

const tabPanelOne = (): TemplateResult => html`
  <div>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed faucibus
    turpis in eu mi bibendum neque egestas congue.
    <sbb-title level="5">Content heading</sbb-title>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec.
  </div>
`;

const tabPanelTwo = (): TemplateResult => html`
  <section>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec.
    <sbb-block-link target="_blank" href="https://www.sbb.ch">Visit sbb.ch</sbb-block-link>
  </section>
`;

const tabPanelFour = (): TemplateResult => html`
  <article>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed faucibus
    turpis in eu mi bibendum neque egestas congue.
  </article>
`;

const DefaultTemplate = ({ size, label, ...args }: Args): TemplateResult => html`
  <sbb-tab-group size=${size} initial-selected-index="0">
    ${firstTabTitle(label, args)} ${tabPanelOne()}

    <sbb-tab-title>Tab title two</sbb-tab-title>
    ${tabPanelTwo()}

    <sbb-tab-title ?disabled=${true}>Tab title three</sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title>Tab title four</sbb-tab-title>
    ${tabPanelFour()}
  </sbb-tab-group>
`;

const IconsAndNumbersTemplate = ({ size, label, ...args }: Args): TemplateResult => html`
  <sbb-tab-group size=${size} initial-selected-index="0">
    ${firstTabTitle(label, args)} ${tabPanelOne()}

    <sbb-tab-title amount=${args.amount} icon-name="swisspass-small"> Tab title two </sbb-tab-title>
    ${tabPanelTwo()}

    <sbb-tab-title ?disabled=${true} amount=${args.amount} icon-name="train-small">
      Tab title three
    </sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title amount=${args.amount} icon-name="pie-small"> Tab title four </sbb-tab-title>
    ${tabPanelFour()}
  </sbb-tab-group>
`;

const NestedTemplate = ({ size, label, ...args }: Args): TemplateResult => html`
  <sbb-tab-group size=${size} initial-selected-index="0">
    ${firstTabTitle(label, args)}
    <sbb-tab-group size=${size} initial-selected-index="1">
      <sbb-tab-title level="2">Nested tab</sbb-tab-title>
      <div>
        Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
        elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis
        rhoncus urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed
        faucibus turpis in eu mi bibendum neque egestas congue.
      </div>

      <sbb-tab-title level="2">Nested tab</sbb-tab-title>
      <section>
        Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
        elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis
        rhoncus urna.
      </section>
    </sbb-tab-group>

    <sbb-tab-title amount=${args.amount} icon-name="swisspass-small"> Tab title two </sbb-tab-title>
    ${tabPanelTwo()}

    <sbb-tab-title ?disabled=${true} amount=${args.amount} icon-name="train-small">
      Tab title three
    </sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title amount=${args.amount} icon-name="pie-small"> Tab title four </sbb-tab-title>
    ${tabPanelFour()}
  </sbb-tab-group>
`;

const label: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Tab1',
  },
};

const iconName: InputType = {
  control: {
    type: 'select',
  },
  options: ['app-icon-small', 'train-small', 'swisspass-small', 'pie-small'],
  table: {
    category: 'Tab1',
  },
};

const amount: InputType = {
  control: {
    type: 'number',
  },
  table: {
    category: 'Tab1',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['s', 'l', 'xl'],
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    disable: true,
  },
};

const basicArgTypes: ArgTypes = {
  label,
  'icon-name': iconName,
  amount: amount,
  size: size,
  negative,
};

const basicArgs: Args = {
  label: 'Tab label one',
  'icon-name': undefined,
  amount: undefined,
  size: size.options![1],
  negative: false,
};

export const defaultTabsSizeL: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const numbersAndIconsSizeL: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options![1] },
};

export const defaultTabsSizeXL: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, size: size.options![2] },
};

export const numbersAndIconsSizeXL: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options![0], size: size.options![2] },
};
export const defaultTabsSizeS: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, size: size.options![0] },
};

export const numbersAndIconsSizeS: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options![0], size: size.options![0] },
};

export const nestedTabGroups: StoryObj = {
  render: NestedTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options![1] },
};

export const tintedBackground: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options![0], negative: true },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-milk)' : 'var(--sbb-color-white)',
    actions: {
      handles: [SbbTabGroupElement.events.didChange],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-tab/sbb-tab-group',
};

export default meta;
