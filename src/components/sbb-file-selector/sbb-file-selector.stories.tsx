/** @jsx h */
import { h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import { InputType } from '@storybook/types';
import { SbbFileSelector } from './sbb-file-selector';
import './sbb-file-selector';
import '../sbb-form-error';

const variant: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: ['default', 'dropzone'],
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
  disabled,
  'title-content': titleContent,
  multiple,
  'multiple-mode': multipleMode,
  accept,
  'accessibility-label': accessibilityLabel,
};

const defaultArgs: Args = {
  variant: variant.options[0],
  disabled: false,
  'title-content': 'Title',
  multiple: false,
  'multiple-mode': multipleMode.options[0],
  accept: undefined,
  'accessibility-label': 'Select from hard disk',
};

const multipleDefaultArgs: Args = {
  ...defaultArgs,
  multiple: true,
  'accessibility-label': 'Select from hard disk - multiple files allowed',
};

const Template = (args): JSX.Element => <sbb-file-selector {...args}></sbb-file-selector>;

const TemplateWithError = (args): JSX.Element => {
  const sbbFormError = <sbb-form-error slot="error">There has been an error.</sbb-form-error>;
  return (
    <sbb-file-selector
      {...args}
      id="sbb-file-selector"
      onFile-changed={(event) => {
        if (event.detail && event.detail.length > 0) {
          document.getElementById('sbb-file-selector').append(sbbFormError);
        } else {
          sbbFormError.remove();
        }
      }}
    ></sbb-file-selector>
  );
};

export const Default: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
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
};

export const DefaultMultiPersistent: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgs, 'multiple-mode': multipleMode.options[1] },
};

export const Dropzone: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options[1] },
};

export const DropzoneDisabled: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options[1], disabled: true },
};

export const DropzoneMulti: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...multipleDefaultArgs, variant: variant.options[1] },
};

export const DropzoneMultiPersistent: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...multipleDefaultArgs,
    variant: variant.options[1],
    'multiple-mode': multipleMode.options[1],
  },
};

export const DefaultWithError: StoryObj = {
  render: TemplateWithError,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

export const DropzoneWithError: StoryObj = {
  render: TemplateWithError,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, variant: variant.options[1] },
};

export const DefaultOnlyPDF: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs, accept: '.pdf' },
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    actions: {
      handles: [SbbFileSelector.events.fileChangedEvent],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-file-selector',
};

export default meta;
