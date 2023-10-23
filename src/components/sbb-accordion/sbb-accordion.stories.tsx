/** @jsx h */
import { h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import { InputType, StoryContext } from '@storybook/types';
import { SbbExpansionPanel } from '../sbb-expansion-panel';
import { withActions } from '@storybook/addon-actions/decorator';
import { Decorator } from '@storybook/web-components';
import './sbb-accordion';
import '../sbb-expansion-panel';
import '../sbb-expansion-panel-header';
import '../sbb-expansion-panel-content';
import '../sbb-icon';

const numberOfPanels: InputType = {
  control: {
    type: 'number',
  },
};

const multi: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Accordion',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Accordion',
  },
};

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [1, 2, 3, 4, 5, 6, null],
  table: {
    category: 'Accordion',
  },
};

const color: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['white', 'milk'],
  table: {
    category: 'Panel',
  },
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Panel',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Panel',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Panel',
  },
};

const headerText: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Header',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Header',
  },
};

const contentText: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Content',
  },
};

const defaultArgTypes: ArgTypes = {
  numberOfPanels,
  multi,
  'disable-animation': disableAnimation,
  'title-level': titleLevel,
  color,
  expanded,
  borderless,
  disabled,
  headerText,
  iconName,
  contentText,
};

const defaultArgs: Args = {
  numberOfPanels: 3,
  multi: false,
  'disable-animation': false,
  'title-level': titleLevel.options[2],
  color: color.options[0],
  expanded: false,
  borderless: false,
  disabled: false,
  headerText: 'This is the header',
  iconName: undefined,
  contentText: 'This is the content: "Lorem ipsum dolor sit amet".',
};

const createExpansionPanelTemplate = (
  numberOfPanels,
  color,
  expanded,
  borderless,
  disabled,
  headerText,
  iconName,
  contentText,
): JSX.Element[] => {
  return new Array(numberOfPanels).fill(null).map((_, index) => (
    <sbb-expansion-panel
      color={color}
      expanded={expanded}
      borderless={borderless}
      disabled={disabled && index === 0}
    >
      <sbb-expansion-panel-header icon-name={iconName}>
        {headerText} {index + 1}
      </sbb-expansion-panel-header>
      <sbb-expansion-panel-content>
        <p>Content {index + 1}</p>
        {contentText}
      </sbb-expansion-panel-content>
    </sbb-expansion-panel>
  ));
};

const Template = ({
  numberOfPanels,
  color,
  expanded,
  borderless,
  disabled,
  headerText,
  iconName,
  contentText,
  ...args
}): JSX.Element => (
  <sbb-accordion {...args}>
    {createExpansionPanelTemplate(
      numberOfPanels,
      color,
      expanded,
      borderless,
      disabled,
      headerText,
      iconName,
      contentText,
    )}
  </sbb-accordion>
);

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Milk: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[1] },
};

export const Borderless: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, borderless: true },
};

export const Disabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const MilkBorderless: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options[1], borderless: true },
};

export const WithIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, iconName: 'swisspass-medium' },
};

export const Expanded: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true },
};

export const Multi: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, multi: true },
};

export const NoAnimation: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'disable-animation': true },
};

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.borderless ? '#bdbdbd' : 'var(--sbb-color-white-default)',
});

const meta: Meta = {
  decorators: [
    (Story, context) => (
      <div style={{ ...wrapperStyle(context), padding: '2rem' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
    actions: {
      handles: [
        SbbExpansionPanel.events.willOpen,
        SbbExpansionPanel.events.didOpen,
        SbbExpansionPanel.events.willClose,
        SbbExpansionPanel.events.didClose,
      ],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-accordion/sbb-accordion',
};

export default meta;
