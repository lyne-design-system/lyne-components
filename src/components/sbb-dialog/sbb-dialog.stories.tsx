/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import sampleImages from '../../global/images';
import isChromatic from 'chromatic';
import { userEvent, within } from '@storybook/testing-library';
import { waitForComponentsReady } from '../../global/testing/wait-for-components-ready';
import { waitForStablePosition } from '../../global/testing/wait-for-stable-position';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { SbbDialog } from './sbb-dialog';
import './sbb-dialog';
import '../sbb-button';
import '../sbb-link';
import '../sbb-title';
import '../sbb-form-field';
import '../sbb-image';
import '../sbb-action-group';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('dialog').shadowRoot.querySelector('dialog.sbb-dialog'),
  );

  await waitForStablePosition(() => canvas.getByTestId('dialog-trigger'));

  const button = canvas.getByTestId('dialog-trigger');
  await userEvent.click(button);
};

const titleContent: InputType = {
  control: {
    type: 'text',
  },
};

const titleLevel: InputType = {
  control: {
    type: 'inline-radio',
  },
  options: [1, 2, 3, 4, 5, 6],
};

const titleBackButton: InputType = {
  control: {
    type: 'boolean',
  },
};

const negative: InputType = {
  control: {
    type: 'boolean',
  },
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const accessibilityCloseLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const accessibilityBackLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const backdropAction: InputType = {
  control: {
    type: 'select',
  },
  options: ['close', 'none'],
};

const basicArgTypes: ArgTypes = {
  'title-content': titleContent,
  'title-level': titleLevel,
  'title-back-button': titleBackButton,
  negative,
  'accessibility-label': accessibilityLabel,
  'accessibility-close-label': accessibilityCloseLabel,
  'accessibility-back-label': accessibilityBackLabel,
  'disable-animation': disableAnimation,
  'backdrop-action': backdropAction,
};

const basicArgs: Args = {
  'title-content': 'A describing title of the dialog',
  'title-level': undefined,
  'title-back-button': true,
  negative: false,
  'accessibility-label': undefined,
  'accessibility-close-label': undefined,
  'accessibility-back-label': undefined,
  'disable-animation': isChromatic(),
  'backdrop-action': backdropAction.options[0],
};

const openDialog = (_event, id): void => {
  const dialog = document.getElementById(id) as HTMLSbbDialogElement;
  dialog.open();
};

const onFormDialogClose = (dialog): void => {
  dialog.addEventListener('will-close', (event) => {
    if (event.detail) {
      document.getElementById(
        'returned-value-message',
      ).innerHTML = `${event.detail.returnValue.message?.value}`;
      document.getElementById(
        'returned-value-animal',
      ).innerHTML = `${event.detail.returnValue.animal?.value}`;
    }
  });
};

const triggerButton = (dialogId): JSX.Element => (
  <sbb-button
    data-testid="dialog-trigger"
    size="m"
    type="button"
    onClick={(event) => openDialog(event, dialogId)}
  >
    Open dialog
  </sbb-button>
);

const actionGroup = (negative): JSX.Element => (
  <sbb-action-group
    slot="action-group"
    align-group="stretch"
    orientation="vertical"
    horizontal-from="medium"
  >
    <sbb-link
      align-self="start"
      icon-name="chevron-small-left-small"
      href="https://www.sbb.ch/en/"
      negative={negative}
      sbb-dialog-close
    >
      Link
    </sbb-link>
    <sbb-button variant="secondary" sbb-dialog-close>
      Cancel
    </sbb-button>
    <sbb-button variant="primary" sbb-dialog-close>
      Confirm
    </sbb-button>
  </sbb-action-group>
);

const codeStyle: Args = {
  padding: 'var(--sbb-spacing-fixed-1x) var(--sbb-spacing-fixed-2x)',
  marginInline: 'var(--sbb-spacing-fixed-2x)',
  borderRadius: 'var(--sbb-border-radius-4x)',
  backgroundColor: 'var(--sbb-color-smoke-alpha-20)',
};

const formDetailsStyle: Args = {
  marginTop: 'var(--sbb-spacing-fixed-4x)',
  padding: 'var(--sbb-spacing-fixed-4x)',
  borderRadius: 'var(--sbb-border-radius-8x)',
  backgroundColor: 'var(--sbb-color-milk-default)',
};

const formStyle: Args = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--sbb-spacing-fixed-4x)',
};

const DefaultTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-1')}
    <sbb-dialog data-testid="dialog" id="my-dialog-1" {...args}>
      <p id="dialog-content-1" style={{ margin: '0' }}>
        Dialog content
      </p>
      {actionGroup(args.negative)}
    </sbb-dialog>
  </Fragment>
);

const SlottedTitleTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-2')}
    <sbb-dialog data-testid="dialog" id="my-dialog-2" {...args}>
      <span slot="title">
        <sbb-icon
          name="book-medium"
          style={{ 'vertical-align': 'sub', 'margin-inline-end': '0.5rem' }}
        ></sbb-icon>
        The Catcher in the Rye
      </span>
      <p id="dialog-content-2" style={{ margin: '0' }}>
        “What really knocks me out is a book that, when you're all done reading it, you wish the
        author that wrote it was a terrific friend of yours and you could call him up on the phone
        whenever you felt like it. That doesn't happen much, though.” ― J.D. Salinger, The Catcher
        in the Rye
      </p>
      {actionGroup(args.negative)}
    </sbb-dialog>
  </Fragment>
);

const LongContentTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-3')}
    <sbb-dialog data-testid="dialog" id="my-dialog-3" {...args}>
      Frodo halted for a moment, looking back. Elrond was in his chair and the fire was on his face
      like summer-light upon the trees. Near him sat the Lady Arwen. To his surprise Frodo saw that
      Aragorn stood beside her; his dark cloak was thrown back, and he seemed to be clad in
      elven-mail, and a star shone on his breast. They spoke together, and then suddenly it seemed
      to Frodo that Arwen turned towards him, and the light of her eyes fell on him from afar and
      pierced his heart.
      <sbb-image
        style={{ 'margin-block': '1rem' }}
        image-src={sampleImages[1]}
        alt="Natural landscape"
        data-chromatic="ignore"
      ></sbb-image>
      He stood still enchanted, while the sweet syllables of the elvish song fell like clear jewels
      of blended word and melody. 'It is a song to Elbereth,'' said Bilbo. 'They will sing that, and
      other songs of the Blessed Realm, many times tonight. Come on!’ —J.R.R. Tolkien, The Lord of
      the Rings: The Fellowship of the Ring, “Many Meetings”
      {actionGroup(args.negative)}
    </sbb-dialog>
  </Fragment>
);

const FormTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-4')}
    <div id="returned-value">
      <div style={formDetailsStyle}>
        <div>
          Your message: <span id="returned-value-message">Hello 👋</span>
        </div>
        <div>
          Your favorite animal: <span id="returned-value-animal">Red Panda</span>
        </div>
      </div>
    </div>
    <sbb-dialog
      data-testid="dialog"
      id="my-dialog-4"
      {...args}
      ref={(dialog) => onFormDialogClose(dialog)}
    >
      <div style={{ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' }}>
        Submit the form below to close the dialog box using the
        <code style={codeStyle}>close(result?: any, target?: HTMLElement)</code>
        method and returning the form values to update the details.
      </div>
      <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
        <sbb-form-field error-space="none" label="Message" size="m">
          <input placeholder="Your custom massage" value="Hello 👋" name="message" />
        </sbb-form-field>
        <sbb-form-field error-space="none" label="Favorite animal" size="m">
          <select name="animal">
            <option>Red Panda</option>
            <option>Cheetah</option>
            <option>Polar Bear</option>
            <option>Elephant</option>
          </select>
        </sbb-form-field>
        <sbb-button type="submit" size="m" sbb-dialog-close>
          Update details
        </sbb-button>
      </form>
    </sbb-dialog>
  </Fragment>
);

const NoFooterTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-5')}
    <sbb-dialog data-testid="dialog" id="my-dialog-5" {...args}>
      <p id="dialog-content-5" style={{ margin: '0' }}>
        “What really knocks me out is a book that, when you're all done reading it, you wish the
        author that wrote it was a terrific friend of yours and you could call him up on the phone
        whenever you felt like it. That doesn't happen much, though.” ― J.D. Salinger, The Catcher
        in the Rye
      </p>
    </sbb-dialog>
  </Fragment>
);

const FullScreenTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('my-dialog-6')}
    <sbb-dialog data-testid="dialog" id="my-dialog-6" {...args}>
      <sbb-title visual-level="2" negative={args.negative} style={{ 'margin-block-start': '0' }}>
        Many Meetings
      </sbb-title>
      Frodo halted for a moment, looking back. Elrond was in his chair and the fire was on his face
      like summer-light upon the trees. Near him sat the Lady Arwen. To his surprise Frodo saw that
      Aragorn stood beside her; his dark cloak was thrown back, and he seemed to be clad in
      elven-mail, and a star shone on his breast. They spoke together, and then suddenly it seemed
      to Frodo that Arwen turned towards him, and the light of her eyes fell on him from afar and
      pierced his heart.
      <sbb-image
        style={{ 'margin-block': '1rem' }}
        image-src={sampleImages[1]}
        alt="Natural landscape"
        data-chromatic="ignore"
      ></sbb-image>
      He stood still enchanted, while the sweet syllables of the elvish song fell like clear jewels
      of blended word and melody. 'It is a song to Elbereth,'' said Bilbo. 'They will sing that, and
      other songs of the Blessed Realm, many times tonight. Come on!’ —J.R.R. Tolkien, The Lord of
      the Rings: The Fellowship of the Ring, “Many Meetings”
      {actionGroup(args.negative)}
    </sbb-dialog>
  </Fragment>
);

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: basicArgs,
  play: isChromatic() && playStory,
};

export const Negative: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    negative: true,
  },
  play: isChromatic() && playStory,
};

export const AllowBackdropClick: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'backdrop-action': backdropAction.options[1] },
  play: isChromatic() && playStory,
};

export const SlottedTitle: StoryObj = {
  render: SlottedTitleTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'title-content': undefined,
    'title-back-button': false,
  },
  play: isChromatic() && playStory,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStory,
};

export const Form: StoryObj = {
  render: FormTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStory,
};

export const NoFooter: StoryObj = {
  render: NoFooterTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStory,
};

export const FullScreen: StoryObj = {
  render: FullScreenTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'title-content': undefined },
  play: isChromatic() && playStory,
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', 'min-height': isChromatic() ? '100vh' : undefined }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbDialog.events.willOpen,
        SbbDialog.events.didOpen,
        SbbDialog.events.willClose,
        SbbDialog.events.didClose,
        SbbDialog.events.backClick,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      story: { inline: false, iframeHeight: '600px' },
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'components/sbb-dialog',
};

export default meta;
