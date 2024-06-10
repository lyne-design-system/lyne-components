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
import { html, nothing } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import { SbbExpansionPanelHeaderElement } from '../expansion-panel-header.js';

import { SbbExpansionPanelElement } from './expansion-panel.js';
import readme from './readme.md?raw';

import '../expansion-panel-content.js';
import '../../icon.js';

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim elit, ultricies in tincidunt
quis, mattis eu quam. Nulla sit amet lorem fermentum, molestie nunc ut, hendrerit risus. Vestibulum rutrum elit et
lacus sollicitudin, quis malesuada lorem vehicula. Suspendisse at augue quis tellus vulputate tempor. Vivamus urna
velit, varius nec est ac, mollis efficitur lorem. Quisque non nisl eget massa interdum tempus. Praesent vel feugiat
metus.`;

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

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [1, 2, 3, 4, 5, 6, null],
};

const color: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['white', 'milk'],
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const borderless: InputType = {
  control: {
    type: 'boolean',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 's'],
};

const defaultArgTypes: ArgTypes = {
  headerText,
  iconName,
  contentText,
  expanded,
  'title-level': titleLevel,
  color,
  borderless,
  disabled,
  size,
};

const defaultArgs: Args = {
  headerText: 'Header',
  iconName: undefined,
  contentText: 'Content',
  expanded: false,
  'title-level': titleLevel.options![2],
  color: color.options![0],
  borderless: false,
  disabled: false,
  size: size.options![0],
};

const Template = ({ headerText, iconName, contentText, ...args }: Args): TemplateResult => html`
  <sbb-expansion-panel ${sbbSpread(args)}>
    <sbb-expansion-panel-header icon-name=${iconName ?? nothing}
      >${headerText}</sbb-expansion-panel-header
    >
    <sbb-expansion-panel-content>${contentText}</sbb-expansion-panel-content>
  </sbb-expansion-panel>
`;

const TemplateSlottedIcon = ({
  headerText,
  iconName,
  contentText,
  ...args
}: Args): TemplateResult => html`
  <sbb-expansion-panel ${sbbSpread(args)}>
    <sbb-expansion-panel-header>
      ${headerText}
      <sbb-icon slot="icon" name=${iconName}></sbb-icon>
    </sbb-expansion-panel-header>
    <sbb-expansion-panel-content>${contentText}</sbb-expansion-panel-content>
  </sbb-expansion-panel>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const Milk: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, color: color.options![1] },
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

export const WithIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, iconName: 'swisspass-medium' },
};

export const WithSlottedIcon: StoryObj = {
  render: TemplateSlottedIcon,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, iconName: 'swisspass-medium' },
};

export const NoHeadingTag: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, 'title-level': titleLevel.options![6] },
};

export const Expanded: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true },
};

export const ExpandedIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, expanded: true, iconName: 'swisspass-medium' },
};

export const LongText: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, headerText: longText, contentText: longText },
};

export const SizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const SizeSWithIcon: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1], iconName: 'swisspass-medium' },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.color === 'white' && context.args.borderless
        ? 'var(--sbb-color-cement)'
        : 'var(--sbb-color-white)',
    actions: {
      handles: [
        SbbExpansionPanelElement.events.willOpen,
        SbbExpansionPanelElement.events.didOpen,
        SbbExpansionPanelElement.events.willClose,
        SbbExpansionPanelElement.events.didClose,
        SbbExpansionPanelHeaderElement.events.toggleExpanded,
      ],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-accordion/sbb-expansion-panel',
};

export default meta;
