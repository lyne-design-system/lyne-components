import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbToggleOptionElement } from './toggle-option.js';

import './toggle-option.js';

describe(`sbb-toggle-option`, () => {
  let element: SbbToggleOptionElement;

  describe('renders', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-toggle-option checked value="Option 1"></sbb-toggle-option>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders unchecked', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-toggle-option value="Option 1"></sbb-toggle-option>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders checked disabled', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-toggle-option checked disabled value="Option 1"></sbb-toggle-option>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describe('renders unchecked disabled', async () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-toggle-option disabled value="Option 1"></sbb-toggle-option>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });
});
