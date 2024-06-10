import { withActions } from '@storybook/addon-actions/decorator';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './action-group.js';
import '../button.js';
import '../link/block-link.js';

const secondaryButtonTemplate = (alignSelf?: string): TemplateResult => html`
  <sbb-secondary-button align-self=${alignSelf || nothing}> Button 1 </sbb-secondary-button>
`;

const buttonTemplate = (alignSelf?: string): TemplateResult => html`
  <sbb-button align-self=${alignSelf || nothing}>Button 2</sbb-button>
`;

const linkTemplate = (alignSelf?: string): TemplateResult => html`
  <sbb-block-link
    align-self=${alignSelf || nothing}
    icon-name="chevron-small-left-small"
    href="https://github.com/sbb-design-systems/lyne-components"
  >
    Link
  </sbb-block-link>
`;

const TemplateTwoElements = (
  alignSelfFirst?: string,
  alignSelfSecond?: string,
): TemplateResult => html`
  ${secondaryButtonTemplate(alignSelfFirst)} ${buttonTemplate(alignSelfSecond)}
`;

const TemplateThreeElements = (
  alignSelfFirst?: string,
  alignSelfSecond?: string,
  alignSelfThird?: string,
): TemplateResult => html`
  ${TemplateTwoElements(alignSelfFirst, alignSelfSecond)} ${linkTemplate(alignSelfThird)}
`;

const CommonTemplateThreeElementsAllocation = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}>${TemplateThreeElements()}</sbb-action-group>
`;

const CommonTemplateTwoElementsAllocation = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}>${TemplateTwoElements()}</sbb-action-group>
`;

const TemplateHorizontalAllocation111 = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}
    >${TemplateThreeElements(undefined, 'center')}</sbb-action-group
  >
`;

const TemplateHorizontalAllocation201 = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}
    >${TemplateThreeElements(undefined, undefined, 'end')}</sbb-action-group
  >
`;

const TemplateHorizontalAllocation102 = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}>${TemplateThreeElements('start')}</sbb-action-group>
`;

const TemplateHorizontalAllocation101 = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}>${TemplateTwoElements(undefined, 'end')}</sbb-action-group>
`;

const TemplateVerticalAllocation300FullWidth = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}
    >${TemplateThreeElements(undefined, undefined, 'start')}</sbb-action-group
  >
`;

const TemplateVerticalAllocation030FullWidth = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}
    >${TemplateThreeElements(undefined, undefined, 'center')}</sbb-action-group
  >
`;

const TemplateVerticalAllocation003FullWidth = (args: Args): TemplateResult => html`
  <sbb-action-group ${sbbSpread(args)}
    >${TemplateThreeElements(undefined, undefined, 'end')}</sbb-action-group
  >
`;

const buttonSize: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 'm', 's'],
};

const linkSize: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's', 'xs'],
};

const orientation: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['horizontal', 'vertical'],
};

const horizontalFrom: InputType = {
  control: {
    type: 'select',
  },
  options: ['unset', 'zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const alignGroup: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['start', 'center', 'stretch', 'end'],
};

const basicArgTypes: ArgTypes = {
  'align-group': alignGroup,
  orientation,
  'horizontal-from': horizontalFrom,
  'button-size': buttonSize,
  'link-size': linkSize,
};

const basicArgs: Args = {
  'align-group': 'start',
  orientation: 'horizontal',
  'horizontal-from': 'unset',
  'button-size': buttonSize.options![0],
  'link-size': linkSize.options![0],
};

const basicArgsVertical = {
  ...basicArgs,
  orientation: 'vertical',
};

const basicArgsVerticalFullWidth = {
  ...basicArgsVertical,
  'align-group': 'stretch',
};

const basicArgsSizeS = {
  ...basicArgs,
  'button-size': buttonSize.options![2],
  'link-size': linkSize.options![2],
};

const basicArgsVerticalSizeS = {
  ...basicArgsVertical,
  'button-size': buttonSize.options![2],
  'link-size': linkSize.options![2],
};

export const HorizontalAllocation3_0_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const HorizontalAllocation1_1_1: StoryObj = {
  render: TemplateHorizontalAllocation111,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const HorizontalAllocation2_0_1: StoryObj = {
  render: TemplateHorizontalAllocation201,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const HorizontalAllocation1_0_2: StoryObj = {
  render: TemplateHorizontalAllocation102,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'align-group': 'end' },
};

export const HorizontalAllocation2_0_0: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const HorizontalAllocation1_0_1: StoryObj = {
  render: TemplateHorizontalAllocation101,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
};

export const VerticalAllocation3_0_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'start' },
};

export const VerticalAllocation2_0_0: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'start' },
};

export const VerticalAllocation0_3_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'center' },
};

export const VerticalAllocation0_2_0: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'center' },
};

export const VerticalAllocation0_0_3: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'end' },
};

export const VerticalAllocation0_0_2: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'align-group': 'end' },
};

export const VerticalAllocation3_0_0FullWidth: StoryObj = {
  render: TemplateVerticalAllocation300FullWidth,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalAllocation2_0_0FullWidth: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalAllocation0_3_0FullWidth: StoryObj = {
  render: TemplateVerticalAllocation030FullWidth,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalAllocation0_2_0FullWidth: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalAllocation0_0_3FullWidth: StoryObj = {
  render: TemplateVerticalAllocation003FullWidth,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalAllocation0_0_2FullWidth: StoryObj = {
  render: CommonTemplateTwoElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalFullWidth },
};

export const VerticalToHorizontal3_0_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVertical, 'horizontal-from': 'medium' },
};

export const HorizontalAllocationSizeS3_0_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsSizeS },
};

export const VerticalAllocationSizeS3_0_0: StoryObj = {
  render: CommonTemplateThreeElementsAllocation,
  argTypes: basicArgTypes,
  args: { ...basicArgsVerticalSizeS, 'align-group': 'start' },
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: ['click'],
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-action-group',
};

export default meta;
