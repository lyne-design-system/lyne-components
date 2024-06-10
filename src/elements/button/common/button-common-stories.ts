import type { InputType } from '@storybook/types';
import type { Args, ArgTypes, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';

import { commonDefaultArgs, commonDefaultArgTypes } from './common-stories.js';

/* eslint-disable lit/binding-positions, @typescript-eslint/naming-convention */
const RequestSubmitTemplate = ({ tag, text }: Args): TemplateResult => html`
  <form id="my-fake-form" action="/submit" method="post" target="_blank">
    <label
      for="input"
      style="display: flex; flex-direction: column; align-items: flex-start; padding-block-end: 2rem;"
    >
      Input required; submit with empty value is impossible due to 'requestSubmit' API validation.
      <input required id="input" />
    </label>
    <${unsafeStatic(tag)} type="submit" form="my-fake-form" name="input" value="input"> ${text} </${unsafeStatic(tag)}>
  </form>
`;
/* eslint-enable lit/binding-positions, @typescript-eslint/naming-convention */

const type: InputType = {
  control: {
    type: 'select',
  },
  options: ['button', 'reset', 'submit'],
  table: {
    category: 'Button',
  },
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Button',
  },
};

const name: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const value: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const form: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const ariaLabel: InputType = {
  control: {
    type: 'text',
  },
};

export const buttonDefaultArgTypes: ArgTypes = {
  ...commonDefaultArgTypes,
  type,
  disabled,
  name,
  value,
  form,
  'aria-label': ariaLabel,
};

export const buttonDefaultArgs: Args = {
  ...commonDefaultArgs,
  type: type.options![0],
  disabled: false,
  name: 'Button Name',
  value: undefined,
  form: undefined,
  'aria-label': undefined,
};

export const requestSubmit: StoryObj = {
  render: RequestSubmitTemplate,
  args: { text: 'Submit form' },
};
