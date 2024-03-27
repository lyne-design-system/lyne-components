import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type {
  Args,
  ArgTypes,
  Decorator,
  StoryContext,
  StoryObj,
  WebComponentsRenderer,
} from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { sbbSpread } from '../../core/dom';

import '../../icon';
import '../../loading-indicator';

const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative ? '#484040' : 'var(--sbb-color-white)',
});

const focusStyle = (context: StoryContext): Record<string, string> =>
  context.args.negative
    ? { '--sbb-focus-outline-color': 'var(--sbb-focus-outline-color-dark)' }
    : {};

/* eslint-disable lit/binding-positions, @typescript-eslint/naming-convention */
const Template = ({ tag, text, active, focusVisible, ...args }: Args): TemplateResult => html`
  <${unsafeStatic(tag)} ${sbbSpread(args)} ?data-active=${active} ?data-focus-visible=${focusVisible}>
    ${text}
  </${unsafeStatic(tag)}>
`;

const IconSlotTemplate = ({
  tag,
  text,
  'icon-name': iconName,
  hiddenIcon,
  ...args
}: Args): TemplateResult => html`
  <${unsafeStatic(tag)} ${sbbSpread(args)}>
    ${text}
    <sbb-icon slot="icon" name=${iconName} style=${hiddenIcon ? 'display: none;' : ''} ></sbb-icon>
  </${unsafeStatic(tag)}>
`;

const LoadingIndicatorTemplate = ({ tag, text, ...args }: Args): TemplateResult => html`
  <${unsafeStatic(tag)} ${sbbSpread(args)}>
    <sbb-loading-indicator
      slot="icon"
      variant="circle"
    ></sbb-loading-indicator>
    ${text}
  </${unsafeStatic(tag)}>
`;

const FixedWidthTemplate = ({ tag, text, ...args }: Args): TemplateResult => html`
  <div>
    <p>
      <${unsafeStatic(tag)} ${sbbSpread(args)} style="width: 200px;">
        ${text}
      </${unsafeStatic(tag)}>
    </p>
    <p>
      <${unsafeStatic(tag)} ${sbbSpread(args)} style="max-width: 100%; width: 600px;">
        Wide Button
      </${unsafeStatic(tag)}>
    </p>
  </div>
`;
/* eslint-enable lit/binding-positions, @typescript-eslint/naming-convention */

const text: InputType = {
  control: {
    type: 'text',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 'm'],
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Icon',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

const tag: InputType = {
  control: {
    type: 'text',
  },
  table: {
    disable: true,
  },
};

export const commonDefaultArgTypes: ArgTypes = {
  tag,
  text,
  negative,
  size,
  'icon-name': iconName,
  'aria-label': ariaLabel,
};

export const commonDefaultArgs: Args = {
  tag: 'TBD',
  text: 'Button',
  negative: false,
  size: size.options[0],
  'icon-name': 'arrow-right-small',
  'aria-label': undefined,
};

export const primary: StoryObj = {
  render: Template,
};

export const primaryNegative: StoryObj = {
  render: Template,
  args: { negative: true },
};

export const primaryDisabled: StoryObj = {
  render: Template,
  args: { disabled: true },
};

export const primaryNegativeDisabled: StoryObj = {
  render: Template,
  args: { negative: true, disabled: true },
};

export const iconOnly: StoryObj = {
  render: Template,
  args: {
    'icon-name': 'arrow-right-small',
    text: undefined,
  },
};

export const iconOnlyNegative: StoryObj = {
  render: Template,
  args: {
    'icon-name': 'arrow-right-small',
    text: undefined,
    negative: true,
  },
};

export const iconOnlyDisabled: StoryObj = {
  render: Template,
  args: {
    'icon-name': 'arrow-right-small',
    text: undefined,
    disabled: true,
  },
};

export const noIcon: StoryObj = {
  render: Template,
  args: { 'icon-name': undefined },
};

export const sizeM: StoryObj = {
  render: Template,
  args: {
    size: size.options[1],
  },
};

export const fixedWidth: StoryObj = {
  render: FixedWidthTemplate,
  args: {
    text: 'Button with long text',
    'icon-name': 'arrow-right-small',
  },
};

export const withSlottedIcon: StoryObj = {
  render: IconSlotTemplate,
  args: {
    'icon-name': 'chevron-small-right-small',
  },
};

export const primaryActive: StoryObj = {
  render: Template,
  args: { active: true },
};

export const primaryNegativeActive: StoryObj = {
  render: Template,
  args: { negative: true, active: true },
};

export const primaryFocusVisible: StoryObj = {
  render: Template,
  args: { focusVisible: true },
};

export const loadingIndicator: StoryObj = {
  render: LoadingIndicatorTemplate,
  args: { disabled: true },
};

export const withHiddenSlottedIcon: StoryObj = {
  render: IconSlotTemplate,
  args: {
    hiddenIcon: true,
    'icon-name': 'chevron-small-right-small',
  },
};

export const commonDecorators = [
  (story: () => WebComponentsRenderer['storyResult'], context: StoryContext) => html`
    <div
      style=${styleMap({
        ...wrapperStyle(context),
        ...focusStyle(context),
        padding: '2rem',
      })}
    >
      ${story()}
    </div>
  `,
  withActions as Decorator,
];
