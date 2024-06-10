/* eslint-disable @typescript-eslint/naming-convention */
/** @jsx h */
import { StoryContext } from '@storybook/html';
import isChromatic from 'chromatic/isChromatic';
import { JSX, h } from 'jsx-dom';

export const SkiplinkList = (): JSX.Element => (
  <sbb-skiplink-list title-level="2" title-content="Skip to">
    <sbb-link href="/">Skip to content</sbb-link>
    <sbb-link href="/">Go to help page</sbb-link>
  </sbb-skiplink-list>
);

export const TimetableInput = (): JSX.Element => (
  <section class="timetable-section sbb-grid">
    <div class="grid-reduced-width">
      <div class="timetable-placeholder"></div>
    </div>
  </section>
);

const onNavigationClose = (dialog): void => {
  dialog.addEventListener('didClose', () => {
    (document.getElementById('nav-marker') as HTMLSbbNavigationMarkerElement).reset();
  });
};

export const Navigation = (): JSX.Element => (
  <sbb-navigation trigger="hamburger-menu" ref={(dialog) => onNavigationClose(dialog)}>
    <sbb-navigation-marker id="nav-marker">
      <sbb-navigation-action id="nav-1">Tickets & Offers</sbb-navigation-action>
      <sbb-navigation-action id="nav-2">Vacations & Recreation</sbb-navigation-action>
      <sbb-navigation-action id="nav-3">Travel information</sbb-navigation-action>
      <sbb-navigation-action id="nav-4" href="https://www.sbb.ch/en/">
        Help & Contact
      </sbb-navigation-action>
    </sbb-navigation-marker>

    <sbb-navigation-marker size="s">
      <sbb-navigation-action id="nav-5">Deutsch</sbb-navigation-action>
      <sbb-navigation-action id="nav-6">Français</sbb-navigation-action>
      <sbb-navigation-action id="nav-7">Italiano</sbb-navigation-action>
      <sbb-navigation-action id="nav-8" active>
        English
      </sbb-navigation-action>
    </sbb-navigation-marker>

    <sbb-navigation-section title-content="Title one" trigger="nav-1">
      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-button size="m" class="navigation-button">
        All Tickets & Offers
      </sbb-button>
    </sbb-navigation-section>

    <sbb-navigation-section title-content="Title two" trigger="nav-2">
      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>
    </sbb-navigation-section>

    <sbb-navigation-section title-content="Title three" trigger="nav-3">
      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-navigation-list label="Label">
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
        <sbb-navigation-action>Label</sbb-navigation-action>
      </sbb-navigation-list>

      <sbb-button
        size="m"
        variant="secondary"
        icon-name="circle-information-small"
        class="navigation-button"
      >
        Travel Information
      </sbb-button>
    </sbb-navigation-section>
  </sbb-navigation>
);

export const DailyTicketProduct = (): JSX.Element => (
  <sbb-card
    aria-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
    color="milk"
    size="s"
  >
    <span class="card-product">
      <sbb-icon name="ticket-route-medium"></sbb-icon>
      <span class="content">
        <sbb-title level="2" visual-level="6">
          Daily ticket
        </sbb-title>
        <span class="sbb-text-s card-description">Valid today</span>
      </span>
      <sbb-button size="m" variant="secondary">
        Buy
      </sbb-button>
    </span>
  </sbb-card>
);

export const BikeProduct = (): JSX.Element => (
  <sbb-card
    aria-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
    color="milk"
    size="s"
  >
    <span class="card-product">
      <sbb-icon name="bicycle-medium"></sbb-icon>
      <span class="content">
        <sbb-title level="2" visual-level="6">
          Bike day pass
        </sbb-title>
        <span class="sbb-text-s card-description">Valid today</span>
      </span>
      <sbb-button size="m" variant="secondary">
        Buy
      </sbb-button>
    </span>
  </sbb-card>
);

export const LiberoProduct = (): JSX.Element => (
  <sbb-card
    aria-label="The text which gets exposed to screen reader users. The text should reflect all the information which gets passed into the components slots and which is visible in the card, either through text or iconography"
    color="milk"
    size="s"
  >
    <span class="card-product">
      <sbb-icon name="ticket-route-medium"></sbb-icon>
      <span class="content">
        <sbb-title level="2" visual-level="6">
          Libero short distance ticket
        </sbb-title>
        <span class="sbb-text-s card-description">Valid today</span>
      </span>
      <sbb-button size="m" variant="secondary">
        Buy
      </sbb-button>
    </span>
  </sbb-card>
);

export const TeaserHero = (): JSX.Element => (
  <section class="sbb-page-spacing">
    <sbb-teaser-hero
      data-chromatic="ignore"
      class="teaser-hero"
      link-content="Learn more"
      image-src="https://cdn.img.sbb.ch/content/dam/internet/lyne/Billetkontrolle.jpg"
      href="https://www.sbb.ch"
    >
      Considerate with SBB Green Class.
    </sbb-teaser-hero>
  </section>
);

export const Footer = (args): JSX.Element => (
  <sbb-footer accessibility-title="Footer" variant="clock-columns" negative={args.negative}>
    <div class="sbb-link-list-button-group">
      <sbb-link-list title-level="2" title-content="Help &amp; Contact." negative={args.negative}>
        <sbb-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          negative={args.negative}
        >
          Refunds
        </sbb-link>
        <sbb-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          negative={args.negative}
        >
          Lost property office
        </sbb-link>
        <sbb-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          negative={args.negative}
        >
          Complaints
        </sbb-link>
        <sbb-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          negative={args.negative}
        >
          Praise
        </sbb-link>
        <sbb-link
          href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
          negative={args.negative}
        >
          Report property damage
        </sbb-link>
      </sbb-link-list>
      <sbb-button
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        variant="primary"
        size="m"
      >
        All help topics
      </sbb-button>
    </div>
    <sbb-link-list title-level="2" title-content="More SBB." negative={args.negative}>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Jobs & careers
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Rail traffic information
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        SBB News
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        SBB Community
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Company
      </sbb-link>
    </sbb-link-list>
    <div class="sbb-link-list-button-group">
      <span>
        <sbb-title level="2" visual-level="5" negative={args.negative} class="footer-title">
          Newsletter.
        </sbb-title>
        <p class="footer-text">
          Our newsletter regularly informs you of attractive offers from SBB via e-mail.
        </p>
      </span>
      <sbb-button
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        variant="secondary"
        size="m"
      >
        Subscribe
      </sbb-button>
    </div>
    <sbb-clock
      {...(isChromatic() ? { 'data-now': new Date('2023-01-24T02:59:27+01:00').valueOf() } : {})}
    ></sbb-clock>
    <sbb-divider negative={args.negative} />
    <sbb-link-list horizontal-from="large" negative={args.negative}>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Refunds
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Lost property office
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Complaints
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Praise
      </sbb-link>
      <sbb-link
        href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html"
        negative={args.negative}
      >
        Report property damage
      </sbb-link>
    </sbb-link-list>
  </sbb-footer>
);

export const wrapperStyle = (context: StoryContext): Record<string, string> => ({
  'background-color': context.args.negative
    ? 'var(--sbb-color-charcoal-default)'
    : 'var(--sbb-color-white-default)',
});
