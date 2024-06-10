import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';

import type { SbbBreadcrumbGroupElement } from './breadcrumb-group.js';
import readme from './readme.md?raw';

import '../../button/secondary-button.js';
import './breadcrumb-group.js';
import '../breadcrumb.js';

const addBreadcrumb = (event: Event): void => {
  const breadcrumbGroup = (event.target as HTMLElement)
    .closest('.container')!
    .querySelector<SbbBreadcrumbGroupElement>('sbb-breadcrumb-group')!;
  const breadcrumb = document.createElement('sbb-breadcrumb');
  breadcrumb.setAttribute('href', '/');
  breadcrumb.textContent = 'Link ' + breadcrumbGroup.children.length;
  breadcrumbGroup.append(breadcrumb);
};

const removeBreadcrumb = (event: Event): void => {
  const breadcrumbGroup = (event.target as HTMLElement)
    .closest('.container')!
    .querySelector<SbbBreadcrumbGroupElement>('sbb-breadcrumb-group')!;
  if (breadcrumbGroup.children.length > 1) {
    breadcrumbGroup.removeChild(breadcrumbGroup.lastElementChild!);
  }
};

const numberOfBreadcrumbs: InputType = {
  control: {
    type: 'number',
  },
};

const text: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Breadcrumb',
  },
};

const hrefs = ['https://www.sbb.ch', 'https://github.com/sbb-design-systems/lyne-components'];
const href: InputType = {
  options: Object.keys(hrefs),
  mapping: hrefs,
  control: {
    type: 'select',
    labels: {
      0: 'sbb.ch',
      1: 'GitHub Lyne Components',
    },
  },
  table: {
    category: 'Breadcrumb',
  },
};

const target: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Breadcrumb',
  },
};

const rel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Breadcrumb',
  },
};

const download: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Breadcrumb',
  },
};

const iconName: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Breadcrumb',
  },
};

const defaultArgTypes: ArgTypes = {
  numberOfBreadcrumbs,
  text,
  href,
  target,
  rel,
  download,
  'icon-name': iconName,
};

const defaultArgs: Args = {
  numberOfBreadcrumbs: 3,
  text: 'Link',
  href: 'https://github.com/sbb-design-systems/lyne-components',
  target: '_blank',
  rel: undefined,
  download: false,
  'icon-name': undefined,
};

const breadcrumbTemplate = (args: Args, text: string, i: number): TemplateResult => html`
  <sbb-breadcrumb ${sbbSpread(args)}> ${text} ${i} </sbb-breadcrumb>
`;

const createBreadcrumbs = ({ numberOfBreadcrumbs, text, ...args }: Args): TemplateResult => html`
  <sbb-breadcrumb href="/" icon-name="house-small"></sbb-breadcrumb>
  ${new Array(numberOfBreadcrumbs - 1)
    .fill(undefined)
    .map((_, i) => breadcrumbTemplate(args, text, i + 1))}
`;

const Template = (args: Args): TemplateResult => html`
  <div class="container">
    <sbb-breadcrumb-group aria-label="You are here:">
      ${createBreadcrumbs(args)}
    </sbb-breadcrumb-group>
    <div style="margin-block: 2rem; gap: 1rem; display: flex;">
      <sbb-secondary-button @click=${(event: Event) => addBreadcrumb(event)}
        >Add</sbb-secondary-button
      >
      <sbb-secondary-button @click=${(event: Event) => removeBreadcrumb(event)}
        >Remove</sbb-secondary-button
      >
    </div>
  </div>
`;

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const CollapsedState: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, numberOfBreadcrumbs: 25 },
};

const meta: Meta = {
  decorators: [
    (story) => html`
      <div style="max-width: 1000px;">
        ${story()}
        <div>Page content</div>
      </div>
    `,
  ],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-breadcrumb/sbb-breadcrumb-group',
};

export default meta;
