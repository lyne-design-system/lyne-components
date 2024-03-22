/** @jsx h */
import { h, JSX } from 'jsx-dom';
import readme from './readme.md';
import { Footer, Navigation, SkiplinkList, wrapperStyle } from './search-overlay.common';
import './search-overlay.scss';
import type { Meta, StoryObj, ArgTypes, Args } from '@storybook/html';
import type { InputType } from '@storybook/types';

/* ************************************************* */
/* Storybook controls                                */
/* ************************************************* */

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

/* ************************************************* */
/* Storybook template                                */
/* ************************************************* */

const Template = (args): JSX.Element => (
  <div>
    <SkiplinkList />

    {/* *************************************************
    Header section
    ************************************************* */}
    <sbb-header hide-on-scroll="true">
      <sbb-header-action id="hamburger-menu" icon-name="hamburger-menu-small" expand-from="small">
        Menu
      </sbb-header-action>
      <div class="spacer" />
      <sbb-header-action icon-name="magnifying-glass-small" href="/">
        Search
      </sbb-header-action>
      <sbb-header-action icon-name="user-small">Sign in</sbb-header-action>
      <sbb-header-action icon-name="globe-small" id="language-menu-trigger" class="last-element">
        English
      </sbb-header-action>
      <sbb-menu trigger="language-menu-trigger">
        <sbb-menu-action>Deutsch</sbb-menu-action>
        <sbb-menu-action>Français</sbb-menu-action>
        <sbb-menu-action>Italiano</sbb-menu-action>
        <sbb-menu-action icon-name="tick-small">English</sbb-menu-action>
      </sbb-menu>
      <a href="https://www.sbb.ch" slot="logo">
        <sbb-logo protective-room="none"></sbb-logo>
      </a>
    </sbb-header>

    <Navigation />

    {/* *************************************************
    Main section
    ************************************************* */}
    <section class="sbb-page-spacing">
      <div class="grid-reduced-width logged-in-overview">
        <sbb-button
          variant="secondary"
          class="all-purchased-tickets-button"
          onClick={() => (document.getElementById('search-dialog') as HTMLSbbDialogElement).open()}
        >
          Open search overlay
        </sbb-button>

        <div>
          <sbb-title level="2" visual-level="1">
            Page content
          </sbb-title>
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </div>
      </div>

      <sbb-dialog id="search-dialog" data-fullscreen negative>
        <div class="sbb-grid search-overlay-grid">
          <div class="grid-reduced-width">
            <sbb-form-field error-space="none" size="m" id="search-overlay-field" borderless>
              <span slot="prefix">
                <sbb-icon name="magnifying-glass-small" role="img"></sbb-icon>
              </span>
              <input placeholder="Search" value="" name="message" />
              <sbb-button
                slot="suffix"
                icon-name="cross-small"
                data-icon-small=""
                role="button"
                variant="primary"
                size="l"
              ></sbb-button>
            </sbb-form-field>
            <div class="search-result__wrapper">
              <div class="search-result-frequent">
                <span>Did you mean maybe:</span>
              </div>
              <a href="http://www.sbb.ch/" class="frequent-searches-item">
                Result title 1
              </a>
              <a href="http://www.sbb.ch/" class="frequent-searches-item">
                Result title 2
              </a>
            </div>
          </div>
        </div>
      </sbb-dialog>
    </section>

    {/* *************************************************
    Footer section
    ************************************************* */}
    <Footer {...args} />
  </div>
);

/* ************************************************* */
/* The Stories                                       */
/* ************************************************* */

/* --- Search ------------------------ */
export const searchSuggestedCorrections: StoryObj = {
  render: Template,
  argTypes: defaultArgTypes,
  args: { ...defaultArgs },
};

/* ************************************************* */
/* Render storybook section and stories              */
/* ************************************************* */

const meta: Meta = {
  decorators: [
    (Story, context) => (
      <div style={wrapperStyle(context)}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: false },
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'pages/search-overlay',
};

export default meta;
