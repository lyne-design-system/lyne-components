import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import type { SbbMenuElement } from './menu.js';

import './menu.js';
import '../menu-button.js';
import '../../button.js';
import '../../divider.js';
import '../../link.js';

describe(`sbb-menu`, () => {
  describe('renders', () => {
    let element: SbbMenuElement;

    beforeEach(async () => {
      const testFixture = await fixture(html`
        <div>
          <sbb-button id="menu-trigger">Menu trigger</sbb-button>
          <sbb-menu trigger="menu-trigger">
            <sbb-block-link href="https://www.sbb.ch/en">Profile</sbb-block-link>
            <sbb-menu-button icon-name="tick-small">View</sbb-menu-button>
            <sbb-menu-button icon-name="pen-small" amount="1" disabled>Edit</sbb-menu-button>
            <sbb-menu-button icon-name="swisspass-small" amount="2">Details</sbb-menu-button>
            <sbb-divider></sbb-divider>
            <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
          </sbb-menu>
        </div>
      `);
      element = testFixture.querySelector('sbb-menu')!;
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders with list', () => {
    let element: SbbMenuElement;

    beforeEach(async () => {
      const testFixture = await fixture(
        html`<div>
          <sbb-button id="menu-trigger">Menu trigger</sbb-button>
          <sbb-menu trigger="menu-trigger">
            <sbb-menu-button icon-name="tick-small">View</sbb-menu-button>
            <sbb-menu-button icon-name="pen-small" amount="1" disabled>Edit</sbb-menu-button>
            <sbb-menu-button icon-name="swisspass-small" amount="2">Details</sbb-menu-button>
            <sbb-menu-button icon-name="cross-small">Cancel</sbb-menu-button>
          </sbb-menu>
        </div>`,
      );
      element = testFixture.querySelector('sbb-menu')!;
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });
});
