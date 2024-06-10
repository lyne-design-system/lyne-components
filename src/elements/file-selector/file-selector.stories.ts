import { withActions } from '@storybook/addon-actions/decorator';
import { within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../storybook/helpers/spread.js';
import { waitForComponentsReady } from '../../storybook/testing/wait-for-components-ready.js';
import type { SbbFormErrorElement } from '../form-error.js';

import { SbbFileSelectorElement } from './file-selector.js';
import readme from './readme.md?raw';
import '../form-error.js';

function addFilesToComponentInput(elem: SbbFileSelectorElement, numberOfFiles: number): void {
  const dataTransfer: DataTransfer = new DataTransfer();
  for (let i: number = 0; i < numberOfFiles; i++) {
    dataTransfer.items.add(
      new File([`Hello world - ${i}`], `hello${i}.txt`, {
        type: 'text/plain',
        lastModified: new Date(i).getMilliseconds(),
      }),
    );
  }
  const input: HTMLInputElement = elem.shadowRoot!.querySelector<HTMLInputElement>('input')!;
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change'));
}

// Story interaction executed after the story renders
const playStory = async (canvasElement: HTMLElement, filesToAdd: number = 1): Promise<void> => {
  const canvas = within(canvasElement);
  await waitForComponentsReady(() => canvas.getByTestId('sbb-file-selector'));
  const fs = canvas.getByTestId('sbb-file-selector') as SbbFileSelectorElement;
  addFilesToComponentInput(fs, filesToAdd);
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

const variant: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['default', 'dropzone'],
};

const size: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['m', 's'],
};

const disabled: InputType = {
  control: {
    type: 'boolean',
  },
};

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const multiple: InputType = {
  control: {
    type: 'boolean',
  },
};

const multipleMode: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['default', 'persistent'],
};

const accept: InputType = {
  control: {
    type: 'text',
  },
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes: ArgTypes = {
  variant,
  size,
  disabled,
  'title-content': titleContent,
  multiple,
  'multiple-mode': multipleMode,
  accept,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  variant: variant.options![0],
  size: size.options![0],
  disabled: false,
  'title-content': 'Title',
  multiple: false,
  'multiple-mode': multipleMode.options![0],
  accept: undefined,
  'accessibility-label': 'Select from hard disk',
};

const multipleDefaultArgs: Args = {
  ...defaultArgs,
  multiple: true,
  'accessibility-label': 'Select from hard disk - multiple files allowed',
};

const multipleDefaultArgsSizeS: Args = {
  ...multipleDefaultArgs,
  size: size.options![1],
};

const Template = (args: Args): TemplateResult =>
  html`<sbb-file-selector ${sbbSpread(args)} data-testid="sbb-file-selector"></sbb-file-selector>`;

const TemplateWithError = (args: Args): TemplateResult => {
  const sbbFormError: SbbFormErrorElement = document.createElement('sbb-form-error');
  sbbFormError.setAttribute('slot', 'error');
  sbbFormError.textContent = 'There has been an error.';

  return html`
    <sbb-file-selector
      ${sbbSpread(args)}
      id="sbb-file-selector"
      data-testid="sbb-file-selector"
      @fileChanged=${(event: CustomEvent<File[]>) => {
        if (event.detail && event.detail.length > 0) {
          (event.target as SbbFileSelectorElement)!.append(sbbFormError);
        } else {
          sbbFormError.remove();
        }
      }}
    ></sbb-file-selector>
  `;
};

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement) : undefined,
};

export const DefaultDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, disabled: true },
};

export const DefaultMulti: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgs },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

export const DefaultMultiPersistent: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgs, 'multiple-mode': multipleMode.options![1] },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

export const Dropzone: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options![1] },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement) : undefined,
};

export const DropzoneDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options![1], disabled: true },
};

export const DropzoneMulti: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgs, variant: variant.options![1] },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

export const DropzoneMultiPersistent: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...multipleDefaultArgs,
    variant: variant.options![1],
    'multiple-mode': multipleMode.options![1],
  },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

export const DefaultWithError: StoryObj = {
  render: TemplateWithError,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement) : undefined,
};

export const DropzoneWithError: StoryObj = {
  render: TemplateWithError,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options![1] },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement) : undefined,
};

export const DefaultOnlyPDF: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, accept: '.pdf' },
};

export const DefaultMultiSizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgsSizeS },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

export const DropzoneMultiSizeS: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgsSizeS, variant: variant.options![1] },
  play: isChromatic() ? ({ canvasElement }) => playStory(canvasElement, 3) : undefined,
};

const meta: Meta = {
  decorators: [withActions as Decorator],
  parameters: {
    actions: {
      handles: [SbbFileSelectorElement.events.fileChangedEvent],
    },
    chromatic: { disableSnapshot: false },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-file-selector',
};

export default meta;
