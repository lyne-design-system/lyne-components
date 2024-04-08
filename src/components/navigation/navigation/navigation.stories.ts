import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, waitFor, within } from '@storybook/test';
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
import { html, nothing } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread';
import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready';

import { SbbNavigationElement } from './navigation';
import readme from './readme.md?raw';
import '../navigation-section';
import '../navigation-marker';
import '../navigation-list';
import '../navigation-button';
import '../navigation-link';
import '../../button/button';
import '../../button/secondary-button';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }: StoryContext): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('navigation').shadowRoot?.querySelector('.sbb-navigation'),
  );

  const button = canvas.getByTestId('navigation-trigger');
  await userEvent.click(button);

  await waitFor(() => canvas.getByTestId('navigation').getAttribute('data-state') === 'opened');
};

const playStoryWithSection = async ({ canvasElement }: StoryContext): Promise<void> => {
  await playStory({ canvasElement } as StoryContext);
  const canvas = within(canvasElement);

  await waitFor(() =>
    canvas.getByTestId('navigation-section').shadowRoot?.querySelector('.sbb-navigation-section'),
  );

  await waitFor(
    () => canvas.getByTestId('navigation-section').getAttribute('data-state') === 'opened',
  );
};

const ariaLabel: InputType = {
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

const basicArgTypes: ArgTypes = {
  'aria-label': ariaLabel,
  'accessibility-close-label': accessibilityCloseLabel,
};

const basicArgs: Args = {
  'aria-label': undefined,
  'accessibility-close-label': undefined,
};

const triggerButton = (id: string): TemplateResult => html`
  <sbb-secondary-button
    data-testid="navigation-trigger"
    id=${id}
    size="l"
    icon-name="hamburger-menu-small"
    aria-label="trigger navigation"
    aria-haspopup="true"
  ></sbb-secondary-button>
`;

const navigationActionsL = (): TemplateResult => html`
  <sbb-navigation-button id="nav-1" data-testid="navigation-section-trigger-1">
    Tickets & Offers
  </sbb-navigation-button>
  <sbb-navigation-button id="nav-2" class="sbb-active" aria-current="page"
    >Vacations & Recreation</sbb-navigation-button
  >
  <sbb-navigation-button id="nav-3">Travel information</sbb-navigation-button>
  <sbb-navigation-link id="nav-4" href="https://www.sbb.ch/en/">
    Help & Contact
  </sbb-navigation-link>
`;

const navigationActionsS = (): TemplateResult => html`
  <sbb-navigation-button id="nav-5" aria-pressed="false">Deutsch</sbb-navigation-button>
  <sbb-navigation-button id="nav-6" aria-pressed="false">Français</sbb-navigation-button>
  <sbb-navigation-button id="nav-7" aria-pressed="true" class="sbb-active"
    >Italiano</sbb-navigation-button
  >
  <sbb-navigation-button id="nav-8" aria-pressed="false">English</sbb-navigation-button>
`;

const navigationList = (label: string, active?: boolean): TemplateResult => html`
  <sbb-navigation-list label=${label}>
    <sbb-navigation-button size="m">Label</sbb-navigation-button>
    <sbb-navigation-button size="m">Label</sbb-navigation-button>
    <sbb-navigation-link
      size="m"
      href="https://www.sbb.ch/en/"
      class=${active ? 'sbb-active' : nothing}
      aria-current=${active ? 'page' : nothing}
    >
      Label
    </sbb-navigation-link>
  </sbb-navigation-list>
`;

const actionLabels = (num: number): TemplateResult[] => {
  const labels: TemplateResult[] = [html`<sbb-navigation-button>Label</sbb-navigation-button>`];
  for (let i = 1; i <= num; i++) {
    labels.push(html`<sbb-navigation-button>Label</sbb-navigation-button>`);
  }
  return labels;
};

const DefaultTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('navigation-trigger-1')}
  <sbb-navigation
    data-testid="navigation"
    id="navigation"
    trigger="navigation-trigger-1"
    ${sbbSpread(args)}
  >
    <sbb-navigation-marker id="nav-marker">${navigationActionsL()}</sbb-navigation-marker>
    <sbb-navigation-marker size="s">${navigationActionsS()}</sbb-navigation-marker>
  </sbb-navigation>
`;

const LongContentTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('navigation-trigger-1')}
  <sbb-navigation
    data-testid="navigation"
    id="navigation"
    trigger="navigation-trigger-1"
    ${sbbSpread(args)}
  >
    <sbb-navigation-marker>${navigationActionsL()}</sbb-navigation-marker>
    <sbb-navigation-marker size="s">${actionLabels(20)}</sbb-navigation-marker>
  </sbb-navigation>
`;

const WithNavigationSectionTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('navigation-trigger-1')}
  <sbb-navigation
    data-testid="navigation"
    id="navigation"
    trigger="navigation-trigger-1"
    ${sbbSpread(args)}
  >
    <sbb-navigation-marker id="nav-marker">${navigationActionsL()}</sbb-navigation-marker>
    <sbb-navigation-marker size="s">${navigationActionsS()}</sbb-navigation-marker>

    <sbb-navigation-section trigger="nav-1" title-content="Title one">
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
      <sbb-button size="m" style="width: fit-content"> All Tickets & Offers </sbb-button>
    </sbb-navigation-section>

    <sbb-navigation-section
      trigger="nav-2"
      title-content="Title two"
      data-testid="navigation-section"
    >
      ${navigationList('Label', true)} ${navigationList('Label')} ${navigationList('Label')}
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
    </sbb-navigation-section>

    <sbb-navigation-section trigger="nav-3" title-content="Title three">
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
      <sbb-secondary-button
        size="m"
        icon-name="circle-information-small"
        style="width: fit-content;"
      >
        Travel Information
      </sbb-secondary-button>
    </sbb-navigation-section>
  </sbb-navigation>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() ? playStory : undefined,
};

export const WithNavigationSection: StoryObj = {
  render: WithNavigationSectionTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: playStoryWithSection,
};

const meta: Meta = {
  decorators: [
    (story) => html` <div style="padding: 2rem; height: 100vh;">${story()}</div> `,
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbNavigationElement.events.willOpen,
        SbbNavigationElement.events.didOpen,
        SbbNavigationElement.events.didClose,
        SbbNavigationElement.events.willClose,
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
  title: 'components/sbb-navigation/sbb-navigation',
};

export default meta;
