/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { StoryContext } from '@storybook/web-components';
import { SbbOption } from './sbb-option';
import '../sbb-form-field';
import '../sbb-select';
import '../sbb-autocomplete';
import './sbb-option';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative
    ? 'var(--sbb-color-black-default)'
    : 'var(--sbb-color-white-default)',
});

const preserveIconSpace: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Wrapper property',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
};

const active: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const numberOfOptions: InputType = {
  control: {
    type: 'number',
  },
};

const defaultArgTypes: ArgTypes = {
  value,
  'icon-name': iconName,
  active,
  disabled,
  numberOfOptions,
  preserveIconSpace,
};

const defaultArgs: Args = {
  value: 'Value',
  'icon-name': undefined,
  active: false,
  disabled: false,
  numberOfOptions: 5,
  preserveIconSpace: false,
};

const createOptions = ({
  value,
  active,
  disabled,
  numberOfOptions,
  preserveIconSpace,
  ...args
}): JSX.Element[] => {
  const style = preserveIconSpace ? { '--sbb-option-icon-container-display': 'block' } : {};
  return [
    ...new Array(numberOfOptions).fill(null).map((_, i) => {
      return (
        <sbb-option
          style={style}
          active={active && i === 0}
          disabled={disabled && i === 0}
          value={`${value} ${i + 1}`}
          {...args}
        >
          {`${value} ${i + 1}`}
        </sbb-option>
      );
    }),
    <sbb-option style={style} {...args} value="long-value">
      Option Lorem ipsum dolor sit amet.
    </sbb-option>,
  ];
};

const StandaloneTemplate = (args): JSX.Element => <Fragment>{createOptions(args)}</Fragment>;

const AutocompleteTemplate = (args): JSX.Element => (
  <sbb-form-field label="sbb-autocomplete" negative={args.negative}>
    <input placeholder="Please select." />
    <sbb-autocomplete>{createOptions(args)}</sbb-autocomplete>
  </sbb-form-field>
);

const SelectTemplate = (args): JSX.Element => (
  <sbb-form-field label="sbb-select" negative={args.negative}>
    <sbb-select placeholder="Please select.">{createOptions(args)}</sbb-select>
  </sbb-form-field>
);

const borderDecorator: Decorator = (Story) => (
  <div style={{ border: '3px solid red' }}>
    <Story />
  </div>
);

export const Standalone: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  decorators: [borderDecorator],
};

export const WithIcon: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'icon-name': 'clock-small' },
  decorators: [borderDecorator],
};

export const WithDisabledState: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
  decorators: [borderDecorator],
};

export const WithActiveState: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, active: true },
  decorators: [borderDecorator],
};

export const WithIconSpace: StoryObj = {
  render: StandaloneTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, preserveIconSpace: true },
  decorators: [borderDecorator],
};

export const Autocomplete: StoryObj = {
  render: AutocompleteTemplate,
  argTypes: { ...defaultArgTypes, negative },
  args: { ...defaultArgs, negative: false },
};

export const Select: StoryObj = {
  render: SelectTemplate,
  argTypes: { ...defaultArgTypes, negative },
  args: { ...defaultArgs, negative: false },
};

const meta: Meta = {
  decorators: [
    (Story, context) => (
      <div style={{ ...wrapperStyle(context), padding: '2rem', width: '350px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: {
      handles: [SbbOption.events.selectionChange, SbbOption.events.optionSelected],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-option/sbb-option',
};

export default meta;
