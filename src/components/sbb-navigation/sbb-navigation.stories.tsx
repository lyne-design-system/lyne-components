/** @jsx h */
import { Fragment, h, JSX } from 'jsx-dom';
import readme from './readme.md?raw';
import isChromatic from 'chromatic';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { waitForComponentsReady } from '../../global/testing/wait-for-components-ready';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj, ArgTypes, Args, Decorator } from '@storybook/web-components';
import type { InputType } from '@storybook/types';
import { SbbNavigation } from './sbb-navigation';
import './sbb-navigation';
import '../sbb-navigation-section';
import '../sbb-navigation-marker';
import '../sbb-navigation-list';
import '../sbb-navigation-action';
import '../sbb-button';

// Story interaction executed after the story renders
const playStory = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitForComponentsReady(() =>
    canvas.getByTestId('navigation').shadowRoot.querySelector('dialog.sbb-navigation'),
  );

  const button = canvas.getByTestId('navigation-trigger');
  userEvent.click(button);

  await waitFor(() =>
    expect(canvas.getByTestId('navigation').getAttribute('data-state') === 'opened').toBeTruthy(),
  );
};

const playStoryWithSection = async ({ canvasElement }): Promise<void> => {
  await playStory({ canvasElement });
  const canvas = within(canvasElement);

  await waitFor(() =>
    expect(
      canvas
        .getByTestId('navigation-section')
        .shadowRoot.querySelector('dialog.sbb-navigation-section'),
    ).toBeTruthy(),
  );
  const actionL = canvas.getByTestId('navigation-section-trigger-1');
  userEvent.click(actionL);
  const actionS = canvas.getByTestId('navigation-section-trigger-2');
  userEvent.click(actionS);
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

const disableAnimation: InputType = {
  control: {
    type: 'boolean',
  },
};

const basicArgTypes: ArgTypes = {
  'accessibility-label': accessibilityLabel,
  'accessibility-close-label': accessibilityCloseLabel,
  'disable-animation': disableAnimation,
};

const basicArgs: Args = {
  'accessibility-label': undefined,
  'accessibility-close-label': undefined,
  'disable-animation': isChromatic(),
};

const triggerButton = (id): JSX.Element => (
  <sbb-button
    data-testid="navigation-trigger"
    id={id}
    variant="secondary"
    size="l"
    icon-name="hamburger-menu-small"
    aria-label="trigger navigation"
    aria-haspopup="true"
  ></sbb-button>
);

const navigationActionsL = (): JSX.Element[] => [
  <sbb-navigation-action id="nav-1" data-testid="navigation-section-trigger-1">
    Tickets & Offers
  </sbb-navigation-action>,
  <sbb-navigation-action id="nav-2">Vacations & Recreation</sbb-navigation-action>,
  <sbb-navigation-action id="nav-3">Travel information</sbb-navigation-action>,
  <sbb-navigation-action id="nav-4" href="https://www.sbb.ch/en/">
    Help & Contact
  </sbb-navigation-action>,
];

const navigationActionsS = (): JSX.Element[] => [
  <sbb-navigation-action id="nav-5">Deutsch</sbb-navigation-action>,
  <sbb-navigation-action id="nav-6">Français</sbb-navigation-action>,
  <sbb-navigation-action id="nav-7" data-testid="navigation-section-trigger-2">
    Italiano
  </sbb-navigation-action>,
  <sbb-navigation-action id="nav-8">English</sbb-navigation-action>,
];

const navigationList = (label): JSX.Element[] => [
  <sbb-navigation-list label={label}>
    <sbb-navigation-action size="m">Label</sbb-navigation-action>
    <sbb-navigation-action size="m">Label</sbb-navigation-action>
    <sbb-navigation-action size="m" href="https://www.sbb.ch/en/">
      Label
    </sbb-navigation-action>
  </sbb-navigation-list>,
];

const actionLabels = (num): JSX.Element[] => {
  const labels = [
    <sbb-navigation-action data-testid="navigation-section-trigger-2">Label</sbb-navigation-action>,
  ];
  for (let i = 1; i <= num; i++) {
    labels.push(<sbb-navigation-action>Label</sbb-navigation-action>);
  }
  return labels;
};

const onNavigationClose = (dialog): void => {
  dialog.addEventListener('didClose', () => {
    (document.getElementById('nav-marker') as HTMLSbbNavigationMarkerElement).reset();
  });
};

const DefaultTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('navigation-trigger-1')}
    <sbb-navigation
      data-testid="navigation"
      id="navigation"
      trigger="navigation-trigger-1"
      ref={(dialog) => onNavigationClose(dialog)}
      {...args}
    >
      <sbb-navigation-marker id="nav-marker">{navigationActionsL()}</sbb-navigation-marker>
      <sbb-navigation-marker size="s">{navigationActionsS()}</sbb-navigation-marker>
    </sbb-navigation>
  </Fragment>
);

const LongContentTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('navigation-trigger-1')}
    <sbb-navigation
      data-testid="navigation"
      id="navigation"
      trigger="navigation-trigger-1"
      {...args}
    >
      <sbb-navigation-marker>{navigationActionsL()}</sbb-navigation-marker>
      <sbb-navigation-marker size="s">{actionLabels(20)}</sbb-navigation-marker>
    </sbb-navigation>
  </Fragment>
);

const WithNavigationSectionTemplate = (args): JSX.Element => (
  <Fragment>
    {triggerButton('navigation-trigger-1')}
    <sbb-navigation
      data-testid="navigation"
      id="navigation"
      trigger="navigation-trigger-1"
      ref={(dialog) => onNavigationClose(dialog)}
      {...args}
    >
      <sbb-navigation-marker id="nav-marker">{navigationActionsL()}</sbb-navigation-marker>
      <sbb-navigation-marker size="s">{navigationActionsS()}</sbb-navigation-marker>

      <sbb-navigation-section
        data-testid="navigation-section"
        trigger="nav-1"
        title-content="Title one"
        disable-animation={args['disable-animation']}
      >
        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}

        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}
        <sbb-button size="m" style={{ width: 'fit-content' }}>
          All Tickets & Offers
        </sbb-button>
      </sbb-navigation-section>

      <sbb-navigation-section
        trigger="nav-2"
        title-content="Title two"
        disable-animation={args['disable-animation']}
      >
        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}
      </sbb-navigation-section>

      <sbb-navigation-section
        trigger="nav-3"
        title-content="Title three"
        disable-animation={args['disable-animation']}
      >
        {navigationList('Label')}
        {navigationList('Label')}
        {navigationList('Label')}
        <sbb-button
          size="m"
          variant="secondary"
          icon-name="circle-information-small"
          style={{ width: 'fit-content' }}
        >
          Travel Information
        </sbb-button>
      </sbb-navigation-section>
    </sbb-navigation>
  </Fragment>
);

export const Default: StoryObj = {
  render: DefaultTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStory,
};

export const LongContent: StoryObj = {
  render: LongContentTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStory,
};

export const WithNavigationSection: StoryObj = {
  render: WithNavigationSectionTemplate,
  argTypes: basicArgTypes,
  args: { ...basicArgs },
  play: isChromatic() && playStoryWithSection,
};

const meta: Meta = {
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', height: '100vh' }}>
        <Story />
      </div>
    ),
    withActions as Decorator,
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    actions: {
      handles: [
        SbbNavigation.events.willOpen,
        SbbNavigation.events.didOpen,
        SbbNavigation.events.didClose,
        SbbNavigation.events.willClose,
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
