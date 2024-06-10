import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import readme from './readme.md?raw';
import './navigation-marker.js';
import '../navigation-button.js';

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 's'],
};

const defaultArgTypes: ArgTypes = {
  size,
};

const defaultArgs: Args = {
  size: size.options![0],
};

const navigationActionsL = (active: boolean): TemplateResult => html`
  <sbb-navigation-button id="nav-1">Tickets & Offers</sbb-navigation-button>
  <sbb-navigation-button id="nav-2" class=${active ? 'sbb-active' : nothing}>
    Vacations & Recreation
  </sbb-navigation-button>
  <sbb-navigation-button id="nav-3">Travel information</sbb-navigation-button>
  <sbb-navigation-button id="nav-4">Help & Contact</sbb-navigation-button>
`;

const navigationActionsS = (active: boolean): TemplateResult => html`
  <sbb-navigation-button id="nav-5">Deutsch</sbb-navigation-button>
  <sbb-navigation-button id="nav-6">Français</sbb-navigation-button>
  <sbb-navigation-button id="nav-7" class=${active ? 'sbb-active' : nothing}>
    Italiano
  </sbb-navigation-button>
  <sbb-navigation-button id="nav-8">English</sbb-navigation-button>
`;

const SizeLTemplate = (args: Args): TemplateResult => html`
  <sbb-navigation-marker ${sbbSpread(args)}>${navigationActionsL(false)}</sbb-navigation-marker>
`;

const SizeSTemplate = (args: Args): TemplateResult => html`
  <sbb-navigation-marker ${sbbSpread(args)}>${navigationActionsS(false)}</sbb-navigation-marker>
`;

const SizeLActiveTemplate = (args: Args): TemplateResult => html`
  <sbb-navigation-marker ${sbbSpread(args)}>${navigationActionsL(true)}</sbb-navigation-marker>
`;

const SizeSActiveTemplate = (args: Args): TemplateResult => html`
  <sbb-navigation-marker ${sbbSpread(args)}>${navigationActionsS(true)}</sbb-navigation-marker>
`;

export const SizeL: StoryObj = {
  render: SizeLTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const SizeS: StoryObj = {
  render: SizeSTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

export const SizeLActive: StoryObj = {
  render: SizeLActiveTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const SizeSActive: StoryObj = {
  render: SizeSActiveTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, size: size.options![1] },
};

const meta: Meta = {
  parameters: {
    backgroundColor: () => 'var(--sbb-color-midnight)',
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-navigation/sbb-navigation-marker',
};

export default meta;
