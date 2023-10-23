/** @jsx h */
import { h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { SbbTabGroup } from './sbb-tab-group';
import './sbb-tab-group';

const firstTabTitle = (label, args): JSX.Element => (
  <sbb-tab-title {...args}>{label}</sbb-tab-title>
);

const tabPanelOne = (): JSX.Element => (
  <div>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed faucibus
    turpis in eu mi bibendum neque egestas congue.
    <h3>Content heading</h3>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec.
  </div>
);

const tabPanelTwo = (): JSX.Element => (
  <section>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec.
  </section>
);

const tabPanelFour = (): JSX.Element => (
  <article>
    Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod
    elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus
    urna neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed faucibus
    turpis in eu mi bibendum neque egestas congue.
  </article>
);

const DefaultTemplate = ({ size, label, ...args }): JSX.Element => (
  <sbb-tab-group size={size} initial-selected-index="0">
    {firstTabTitle(label, args)}
    {tabPanelOne()}

    <sbb-tab-title>Tab title two</sbb-tab-title>
    {tabPanelTwo()}

    <sbb-tab-title disabled={true}>Tab title three</sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title>Tab title four</sbb-tab-title>
    {tabPanelFour()}
  </sbb-tab-group>
);

const IconsAndNumbersTemplate = ({ size, label, ...args }): JSX.Element => (
  <sbb-tab-group size={size} initial-selected-index="0">
    {firstTabTitle(label, args)}
    {tabPanelOne()}

    <sbb-tab-title amount={args.amount} icon-name="swisspass-small">
      Tab title two
    </sbb-tab-title>
    {tabPanelTwo()}

    <sbb-tab-title disabled={true} amount={args.amount} icon-name="train-small">
      Tab title three
    </sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title amount={args.amount} icon-name="pie-small">
      Tab title four
    </sbb-tab-title>
    {tabPanelFour()}
  </sbb-tab-group>
);

const NestedTemplate = ({ size, label, ...args }): JSX.Element => (
  <sbb-tab-group size={size} initial-selected-index="0">
    {firstTabTitle(label, args)}
    <sbb-tab-group size={size} initial-selected-index="1">
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

    <sbb-tab-title amount={args.amount} icon-name="swisspass-small">
      Tab title two
    </sbb-tab-title>
    {tabPanelTwo()}

    <sbb-tab-title disabled={true} amount={args.amount} icon-name="train-small">
      Tab title three
    </sbb-tab-title>
    <div>I was disabled.</div>

    <sbb-tab-title amount={args.amount} icon-name="pie-small">
      Tab title four
    </sbb-tab-title>
    {tabPanelFour()}
  </sbb-tab-group>
);

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
  options: ['l', 'xl'],
};

const basicArgTypes: ArgTypes = {
  label,
  'icon-name': iconName,
  amount: amount,
  size: size,
};

const basicArgs: Args = {
  label: 'Tab label one',
  'icon-name': undefined,
  amount: undefined,
  size: size.options[0],
};

const templateRes = [
  (Story) => (
    <div style={{ padding: '2rem' }}>
      <Story />
    </div>
  ),
  withActions as Decorator,
];

export const defaultTabsSizeL: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  decorators: templateRes,
};

export const numbersAndIconsSizeL: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options[0] },
  decorators: templateRes,
};

export const defaultTabsSizeXL: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, size: size.options[1] },
  decorators: templateRes,
};

export const numbersAndIconsSizeXL: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options[0], size: size.options[1] },
  decorators: templateRes,
};

export const nestedTabGroups: StoryObj = {
  render: NestedTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options[0] },
  decorators: templateRes,
};

export const tintedBackground: StoryObj = {
  render: IconsAndNumbersTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, amount: 16, 'icon-name': iconName.options[0] },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--sbb-color-milk-default)', padding: '2rem' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
};

const meta: Meta = {
  parameters: {
    actions: {
      handles: [SbbTabGroup.events.selectedTabChanged],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-tab/sbb-tab-group',
};

export default meta;
