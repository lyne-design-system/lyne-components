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
import isChromatic from 'chromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { waitForComponentsReady } from '../../storybook/testing/wait-for-components-ready';
import { waitForStablePosition } from '../../storybook/testing/wait-for-stable-position';
import { sbbSpread } from '../core/dom';
import sampleImages from '../core/images';

import { SbbDialogElement } from './dialog';
import readme from './readme.md?raw';

import '../button/secondary-button';
import '../button/button';
import '../link/block-link';
import '../title';
import '../form-field';
import '../image';
import '../action-group';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('dialog').shadowRoot!.querySelector('.sbb-dialog'),
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
  'backdrop-action': backdropAction.options[0],
};

const openDialog = (_event: PointerEvent, id: string): void => {
  const dialog = document.getElementById(id) as SbbDialogElement;
  dialog.open();
};

const triggerButton = (dialogId: string): TemplateResult => html`
  <sbb-button
    data-testid="dialog-trigger"
    size="m"
    type="button"
    @click=${(event: PointerEvent) => openDialog(event, dialogId)}
  >
    Open dialog
  </sbb-button>
`;

const actionGroup = (negative: boolean): TemplateResult => html`
  <sbb-action-group
    slot="action-group"
    align-group="stretch"
    orientation="vertical"
    horizontal-from="medium"
  >
    <sbb-block-link
      align-self="start"
      icon-name="chevron-small-left-small"
      href="https://www.sbb.ch/en/"
      ?negative=${negative}
      sbb-dialog-close
    >
      Link
    </sbb-block-link>
    <sbb-secondary-button sbb-dialog-close> Cancel </sbb-secondary-button>
    <sbb-button sbb-dialog-close> Confirm </sbb-button>
  </sbb-action-group>
`;

const codeStyle: Args = {
  padding: 'var(--sbb-spacing-fixed-1x) var(--sbb-spacing-fixed-2x)',
  borderRadius: 'var(--sbb-border-radius-4x)',
  backgroundColor: 'var(--sbb-color-smoke-alpha-20)',
};

const formDetailsStyle: Args = {
  marginTop: 'var(--sbb-spacing-fixed-4x)',
  padding: 'var(--sbb-spacing-fixed-4x)',
  borderRadius: 'var(--sbb-border-radius-8x)',
  backgroundColor: 'var(--sbb-color-milk)',
};

const formStyle: Args = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--sbb-spacing-fixed-4x)',
};

const DefaultTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-1')}
  <sbb-dialog data-testid="dialog" id="my-dialog-1" ${sbbSpread(args)}>
    <p id="dialog-content-1" style=${styleMap({ margin: '0' })}>Dialog content</p>
    ${actionGroup(args.negative)}
  </sbb-dialog>
`;

const SlottedTitleTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-2')}
  <sbb-dialog data-testid="dialog" id="my-dialog-2" ${sbbSpread(args)}>
    <span slot="title">
      <sbb-icon name="book-medium" style=${styleMap({ 'vertical-align': 'sub' })}></sbb-icon>
      The Catcher in the Rye
    </span>
    <p id="dialog-content-2" style=${styleMap({ margin: '0' })}>
      “What really knocks me out is a book that, when you're all done reading it, you wish the
      author that wrote it was a terrific friend of yours and you could call him up on the phone
      whenever you felt like it. That doesn't happen much, though.” ― J.D. Salinger, The Catcher in
      the Rye
    </p>
    ${actionGroup(args.negative)}
  </sbb-dialog>
`;

const LongContentTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-3')}
  <sbb-dialog data-testid="dialog" id="my-dialog-3" ${sbbSpread(args)}>
    Frodo halted for a moment, looking back. Elrond was in his chair and the fire was on his face
    like summer-light upon the trees. Near him sat the Lady Arwen. To his surprise Frodo saw that
    Aragorn stood beside her; his dark cloak was thrown back, and he seemed to be clad in
    elven-mail, and a star shone on his breast. They spoke together, and then suddenly it seemed to
    Frodo that Arwen turned towards him, and the light of her eyes fell on him from afar and pierced
    his heart.
    <sbb-image
      style=${styleMap({ 'margin-block': '1rem' })}
      image-src=${sampleImages[1]}
      alt="Natural landscape"
      data-chromatic="ignore"
    ></sbb-image>
    He stood still enchanted, while the sweet syllables of the elvish song fell like clear jewels of
    blended word and melody. 'It is a song to Elbereth,'' said Bilbo. 'They will sing that, and
    other songs of the Blessed Realm, many times tonight. Come on!’ —J.R.R. Tolkien, The Lord of the
    Rings: The Fellowship of the Ring, “Many Meetings” ${actionGroup(args.negative)}
  </sbb-dialog>
`;

const FormTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-4')}
  <div id="returned-value">
    <div style=${styleMap(formDetailsStyle)}>
      <div>Your message: <span id="returned-value-message">Hello 👋</span></div>
      <div>Your favorite animal: <span id="returned-value-animal">Red Panda</span></div>
    </div>
  </div>
  <sbb-dialog
    data-testid="dialog"
    id="my-dialog-4"
    @willClose=${(event: CustomEvent) => {
      if (event.detail) {
        document.getElementById('returned-value-message')!.innerHTML =
          `${event.detail.returnValue.message?.value}`;
        document.getElementById('returned-value-animal')!.innerHTML =
          `${event.detail.returnValue.animal?.value}`;
      }
    }}
    ${sbbSpread(args)}
  >
    <div style=${styleMap({ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' })}>
      Submit the form below to close the dialog box using the
      <code style=${styleMap(codeStyle)}>close(result?: any, target?: HTMLElement)</code>
      method and returning the form values to update the details.
    </div>
    <form style=${styleMap(formStyle)} @submit=${(e: SubmitEvent) => e.preventDefault()}>
      <sbb-form-field error-space="none" size="m">
        <label>Message</label>
        <input placeholder="Your custom massage" value="Hello 👋" name="message" />
      </sbb-form-field>
      <sbb-form-field error-space="none" size="m">
        <label>Favorite animal</label>
        <select name="animal">
          <option>Red Panda</option>
          <option>Cheetah</option>
          <option>Polar Bear</option>
          <option>Elephant</option>
        </select>
      </sbb-form-field>
      <sbb-button type="submit" size="m" sbb-dialog-close> Update details </sbb-button>
    </form>
  </sbb-dialog>
`;

const NoFooterTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-5')}
  <sbb-dialog data-testid="dialog" id="my-dialog-5" ${sbbSpread(args)}>
    <p id="dialog-content-5" style=${styleMap({ margin: '0' })}>
      “What really knocks me out is a book that, when you're all done reading it, you wish the
      author that wrote it was a terrific friend of yours and you could call him up on the phone
      whenever you felt like it. That doesn't happen much, though.” ― J.D. Salinger, The Catcher in
      the Rye
    </p>
  </sbb-dialog>
`;

const FullScreenTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-dialog-6')}
  <sbb-dialog data-testid="dialog" id="my-dialog-6" ${sbbSpread(args)}>
    <sbb-title
      visual-level="2"
      ?negative=${args.negative}
      style=${styleMap({ 'margin-block-start': '0' })}
    >
      Many Meetings
    </sbb-title>
    Frodo halted for a moment, looking back. Elrond was in his chair and the fire was on his face
    like summer-light upon the trees. Near him sat the Lady Arwen. To his surprise Frodo saw that
    Aragorn stood beside her; his dark cloak was thrown back, and he seemed to be clad in
    elven-mail, and a star shone on his breast. They spoke together, and then suddenly it seemed to
    Frodo that Arwen turned towards him, and the light of her eyes fell on him from afar and pierced
    his heart.
    <sbb-image
      style=${styleMap({ 'margin-block': '1rem' })}
      image-src=${sampleImages[1]}
      alt="Natural landscape"
      data-chromatic="ignore"
    ></sbb-image>
    He stood still enchanted, while the sweet syllables of the elvish song fell like clear jewels of
    blended word and melody. 'It is a song to Elbereth,'' said Bilbo. 'They will sing that, and
    other songs of the Blessed Realm, many times tonight. Come on!’ —J.R.R. Tolkien, The Lord of the
    Rings: The Fellowship of the Ring, “Many Meetings” ${actionGroup(args.negative)}
  </sbb-dialog>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: basicArgs,
  play: isChromatic() ? playStory : undefined,
};

export const Negative: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    negative: true,
  },
  play: isChromatic() ? playStory : undefined,
};

export const AllowBackdropClick: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'backdrop-action': backdropAction.options[1] },
  play: isChromatic() ? playStory : undefined,
};

export const SlottedTitle: StoryObj = {
  render: SlottedTitleTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'title-content': undefined,
    'title-back-button': false,
  },
  play: isChromatic() ? playStory : undefined,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const Form: StoryObj = {
  render: FormTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const NoFooter: StoryObj = {
  render: NoFooterTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const FullScreen: StoryObj = {
  render: FullScreenTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs, 'title-content': undefined },
  play: isChromatic() ? playStory : undefined,
};

const meta: Meta = {
  decorators: [
    (story) => html`
      <div
        style=${styleMap({ padding: '2rem', 'min-height': isChromatic() ? '100vh' : undefined })}
      >
        ${story()}
      </div>
    `,
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbDialogElement.events.willOpen,
        SbbDialogElement.events.didOpen,
        SbbDialogElement.events.willClose,
        SbbDialogElement.events.didClose,
        SbbDialogElement.events.backClick,
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
