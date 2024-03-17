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

import { SbbOverlayElement } from './overlay';
import readme from './readme.md?raw';

import '../title';
import '../button';
import '../link';
import '../form-field';
import '../image';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('overlay').shadowRoot!.querySelector('.sbb-overlay'),
  );

  await waitForStablePosition(() => canvas.getByTestId('overlay-trigger'));

  const button = canvas.getByTestId('overlay-trigger');
  await userEvent.click(button);
};

const expanded: InputType = {
  control: {
    type: 'boolean',
  },
};

const backButton: InputType = {
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

const basicArgTypes: ArgTypes = {
  expanded,
  'back-button': backButton,
  accessibilityCloseLabel,
  accessibilityBackLabel,
  negative,
  'accessibility-label': accessibilityLabel,
  'disable-animation': disableAnimation,
};

const basicArgs: Args = {
  expanded: false,
  'back-button': false,
  accessibilityCloseLabel: 'Close overlay',
  accessibilityBackLabel: 'Go back',
  negative: false,
  'accessibility-label': undefined,
  'disable-animation': isChromatic(),
};

const openOverlay = (_event: PointerEvent, id: string): void => {
  const overlay = document.getElementById(id) as SbbOverlayElement;
  overlay.open();
};

const triggerButton = (overlayId: string, triggerId?: string): TemplateResult => html`
  <sbb-button
    data-testid=${triggerId || 'overlay-trigger'}
    aria-haspopup="dialog"
    aria-controls=${overlayId}
    size="m"
    type="button"
    @click=${(event: PointerEvent) => openOverlay(event, overlayId)}
  >
    Open overlay
  </sbb-button>
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

const textBlockStyle = (negative: boolean): Args => {
  return {
    position: 'relative',
    marginBlockStart: '1rem',
    padding: '1rem',
    backgroundColor: negative ? 'var(--sbb-color-metal)' : 'var(--sbb-color-cloud)',
    borderRadius: 'var(--sbb-border-radius-4x)',
  };
};

const textBlock = (negative: boolean): TemplateResult => html`
  <div style=${styleMap(textBlockStyle(negative))}>
    J.R.R. Tolkien, the mastermind behind Middle-earth's enchanting world, was born on January 3,
    1892. With "The Hobbit" and "The Lord of the Rings", he pioneered fantasy literature. Tolkien's
    linguistic brilliance and mythic passion converge in a literary legacy that continues to
    transport readers to magical realms.
  </div>
`;

const DefaultTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-overlay-2')}
  <sbb-overlay data-testid="overlay" id="my-overlay-2" ${sbbSpread(args)}>
    <div class="overlay-content" data-testid="content">
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
      elven-mail, and a star shone on his breast. They spoke together, and then suddenly it seemed
      to Frodo that Arwen turned towards him, and the light of her eyes fell on him from afar and
      pierced his heart.
      <sbb-image
        style=${styleMap({ 'margin-block': '1rem' })}
        image-src=${sampleImages[1]}
        alt="Natural landscape"
        data-chromatic="ignore"
      ></sbb-image>
      He stood still enchanted, while the sweet syllables of the elvish song fell like clear jewels
      of blended word and melody. 'It is a song to Elbereth,'' said Bilbo. 'They will sing that, and
      other songs of the Blessed Realm, many times tonight. Come on!’ —J.R.R. Tolkien, The Lord of
      the Rings: The Fellowship of the Ring, “Many Meetings” ${textBlock(args.negative)}
    </div>
  </sbb-overlay>
`;

const FormTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-overlay-3')}
  <div id="returned-value">
    <div style=${styleMap(formDetailsStyle)}>
      <div>Your message: <span id="returned-value-message">Hello 👋</span></div>
      <div>Your favorite animal: <span id="returned-value-animal">Red Panda</span></div>
    </div>
  </div>
  <sbb-overlay
    data-testid="overlay"
    id="my-overlay-3"
    @willClose=${(event: CustomEvent) => {
      if (event.detail.returnValue) {
        document.getElementById('returned-value-message')!.innerHTML =
          `${event.detail.returnValue.message?.value}`;
        document.getElementById('returned-value-animal')!.innerHTML =
          `${event.detail.returnValue.animal?.value}`;
      }
    }}
    ${sbbSpread(args)}
  >
    <div class="overlay-content">
      <div style=${styleMap({ 'margin-block-end': 'var(--sbb-spacing-fixed-4x)' })}>
        Submit the form below to close the overlay box using the
        <code style=${styleMap(codeStyle)}>close(result?: any, target?: HTMLElement)</code>
        method and returning the form values to update the details.
      </div>
      <form style=${styleMap(formStyle)} @submit=${(e: SubmitEvent) => e.preventDefault()}>
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
        <sbb-button type="submit" size="m" sbb-overlay-close> Update details </sbb-button>
      </form>
    </div>
  </sbb-overlay>
`;

const NestedTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('my-overlay-5')}
  <sbb-overlay data-testid="overlay" id="my-overlay-5" ${sbbSpread(args)}>
    <div class="overlay-content">
      Click the button to open a nested
      overlay.&nbsp;${triggerButton('my-overlay-6', 'nested-trigger-id')}
    </div>
    <sbb-overlay data-testid="nested-overlay" id="my-overlay-6" ${sbbSpread(args)}>
      <p class="overlay-content">
        Nested overlay content. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </p>
    </sbb-overlay>
  </sbb-overlay>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
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

export const Expanded: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    expanded: true,
  },
};

export const WithBackButton: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: {
    ...basicArgs,
    'back-button': true,
  },
};

export const Form: StoryObj = {
  render: FormTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const Nested: StoryObj = {
  render: NestedTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
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
        SbbOverlayElement.events.willOpen,
        SbbOverlayElement.events.didOpen,
        SbbOverlayElement.events.willClose,
        SbbOverlayElement.events.didClose,
        SbbOverlayElement.events.backClick,
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
  title: 'components/sbb-overlay',
};

export default meta;
