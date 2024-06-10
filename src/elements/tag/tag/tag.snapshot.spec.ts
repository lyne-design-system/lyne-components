import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbTagElement } from './tag.js';

import './tag.js';
import '../../icon.js';

describe(`sbb-tag`, () => {
  let element: SbbTagElement;

  describe('renders unchecked', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-tag value="all" aria-label="Check to remove filters">All</sbb-tag>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders checked', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-tag checked value="info">Info</sbb-tag>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders disabled with icon and amount', async () => {
    beforeEach(async () => {
      element = await fixture(html`
        <sbb-tag disabled amount="123" icon-name="circle-information-small" value="information">
          Info
        </sbb-tag>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders slotted icon and amount', async () => {
    beforeEach(async () => {
      element = await fixture(html`
        <sbb-tag value="foo">
          <sbb-icon
            aria-hidden="true"
            data-namespace="default"
            name="cross-small"
            role="img"
            slot="icon"
          >
          </sbb-icon>
          Info
          <span slot="amount">123</span>
        </sbb-tag>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(html`<sbb-tag value="Value">Label</sbb-tag>`);
});
