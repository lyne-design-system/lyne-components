import { userEvent, waitFor, within } from '@storybook/test';
import type { InputType } from '@storybook/types';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/web-components';
import isChromatic from 'chromatic/isChromatic';
import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import { waitForComponentsReady } from '../../../storybook/testing/wait-for-components-ready.js';

import readme from './readme.md?raw';
import '../../button.js';
import '../navigation-list.js';
import '../navigation-button.js';
import '../navigation-link.js';
import '../navigation-marker.js';
import '../navigation.js';
import './navigation-section.js';

// Story interaction executed after the story renders
const playStory = async (trigger: string, canvasElement: HTMLElement): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('navigation').shadowRoot?.querySelector('.sbb-navigation'),
  );

  const button = canvas.getByTestId('navigation-trigger');
  await userEvent.click(button);
  await waitFor(() => canvas.getByTestId('navigation').getAttribute('data-state') === 'opened');

  await waitFor(() =>
    canvas.getByTestId('navigation-section').shadowRoot?.querySelector('.sbb-navigation-section'),
  );
  const action = canvas.getByTestId(trigger);
  await userEvent.click(action);
};

const accessibilityLabel: InputType = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Accessibility',
  },
};

const basicArgTypes: ArgTypes = {
  'accessibility-label': accessibilityLabel,
};

const basicArgs: Args = {
  'accessibility-label': undefined,
};

const triggerButton = (id: string): TemplateResult => html`
  <sbb-secondary-button
    data-testid="navigation-trigger"
    id=${id}
    size="l"
    icon-name="hamburger-menu-small"
  ></sbb-secondary-button>
`;

const navigationActionsL = (): TemplateResult => html`
  <sbb-navigation-button id="nav-1" data-testid="navigation-section-trigger-1">
    Label
  </sbb-navigation-button>
  <sbb-navigation-button id="nav-2" data-testid="navigation-section-trigger-2">
    Label
  </sbb-navigation-button>
  <sbb-navigation-button id="nav-3">Label</sbb-navigation-button>
`;

const navigationList = (label: string): TemplateResult => html`
  <sbb-navigation-list label=${label}>
    <sbb-navigation-button size="m">Label</sbb-navigation-button>
    <sbb-navigation-button size="m">Label</sbb-navigation-button>
    <sbb-navigation-link size="m" href="https://www.sbb.ch/en/"> Label </sbb-navigation-link>
  </sbb-navigation-list>
`;

const DefaultTemplate = (args: Args): TemplateResult => html`
  ${triggerButton('navigation-trigger-1')}
  <sbb-navigation data-testid="navigation" id="navigation" trigger="navigation-trigger-1">
    <sbb-navigation-marker id="nav-marker">${navigationActionsL()}</sbb-navigation-marker>

    <sbb-navigation-section
      title-content="Title one"
      data-testid="navigation-section"
      id="navigation-section"
      trigger="nav-1"
      ${sbbSpread(args)}
    >
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}

      <sbb-button size="m" style="width: fit-content;"> Button </sbb-button>
    </sbb-navigation-section>

    <sbb-navigation-section
      title-content="Title two"
      id="navigation-section"
      trigger="nav-2"
      ${sbbSpread(args)}
    >
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
      ${navigationList('Label')} ${navigationList('Label')} ${navigationList('Label')}
      ${navigationList('Label')} ${navigationList('Label')}

      <sbb-secondary-button size="m" style="width: fit-content;" sbb-navigation-close>
        Close navigation
      </sbb-secondary-button>
    </sbb-navigation-section>
  </sbb-navigation>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic()
    ? ({ canvasElement }) => playStory('navigation-section-trigger-1', canvasElement)
    : undefined,
};

export const LongContent: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic()
    ? ({ canvasElement }) => playStory('navigation-section-trigger-2', canvasElement)
    : undefined,
};

const meta: Meta = {
  parameters: {
    chromatic: { disableSnapshot: false },
    docs: {
      // Setting the iFrame height ensures that the story has enough space when used in the docs section.
      story: { inline: false, iframeHeight: '600px' },
      extractComponentDescription: () => readme,
    },
  },
  title: 'elements/sbb-navigation/sbb-navigation-section',
};

export default meta;
