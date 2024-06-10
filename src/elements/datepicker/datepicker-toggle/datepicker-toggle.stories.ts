import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type {
  Meta,
  StoryObj,
  ArgTypes,
  Args,
  Decorator,
  StoryContext,
} from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready.js';
import { waitForStablePosition } from '../../../storybook/testing/wait-for-stable-position.js';
import type { SbbPopoverTriggerElement } from '../../popover.js';

import readme from './readme.md?raw';

import '../../form-field.js';
import '../datepicker.js';
import './datepicker-toggle.js';

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const defaultArgTypes: ArgTypes = {
  negative,
};

const defaultArgs: Args = {
  negative: false,
};

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);
  const queryTrigger = (): SbbPopoverTriggerElement =>
    canvas
      .getByTestId('toggle')
      .shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;

  await waitForComponentsReady(queryTrigger);

  await waitForStablePosition(queryTrigger);

  const toggle = queryTrigger();
  userEvent.click(toggle);
};

const StandaloneTemplate = (args: Args, picker?: string): TemplateResult => html`
  <sbb-datepicker-toggle
    ${sbbSpread(args)}
    date-picker=${picker || nothing}
    data-testid="toggle"
  ></sbb-datepicker-toggle>
`;

const PickerAndButtonTemplate = (args: Args): TemplateResult => html`
  <div style=${styleMap({ display: 'flex', gap: '1em' })}>
    ${StandaloneTemplate(args, 'datepicker')}
    <sbb-datepicker
      id="datepicker"
      input="datepicker-input"
      now=${isChromatic() ? '2023-01-12T00:00:00Z' : nothing}
    ></sbb-datepicker>
    <input id="datepicker-input" />
  </div>
`;

const FormFieldTemplate = ({ negative, ...args }: Args): TemplateResult => html`
  <sbb-form-field ?negative=${negative}>
    <input />
    <sbb-datepicker now=${isChromatic() ? '2023-01-12T00:00:00Z' : nothing}></sbb-datepicker>
    ${StandaloneTemplate(args)}
  </sbb-form-field>
`;

export const WithPicker: StoryObj = {
  render: PickerAndButtonTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const InFormField: StoryObj = {
  render: FormFieldTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? playStory : undefined,
};

export const InFormFieldNegative: StoryObj = {
  render: FormFieldTemplate,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, negative: true },
  play: isChromatic() ? playStory : undefined,
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    backgroundColor: (context: StoryContext) =>
      context.args.negative ? 'var(--sbb-color-black)' : 'var(--sbb-color-white)',
    chromatic: { disableSnapshot: false },
    actions: {
      handles: ['click'],
    },
    docs: {
      // Setting the iFrame height ensures that the story has enough space when used in the docs section.
      story: { inline: false, iframeHeight: '600px' },
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-datepicker/sbb-datepicker-toggle',
};

export default meta;
