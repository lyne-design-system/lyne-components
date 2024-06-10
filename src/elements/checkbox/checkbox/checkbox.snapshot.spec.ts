import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbCheckboxElement } from './checkbox.js';

import './checkbox.js';

describe(`sbb-checkbox`, () => {
  let element: SbbCheckboxElement;

  describe('should render unchecked', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-checkbox>Label</sbb-checkbox>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('should render checked', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-checkbox checked>Label</sbb-checkbox>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('should render indeterminate', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-checkbox indeterminate>Label</sbb-checkbox>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('should render unchecked disabled', async () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-checkbox disabled>Label</sbb-checkbox>`);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(html`<sbb-checkbox>Label</sbb-checkbox>`, 'Unchecked - A11y tree');

  testA11yTreeSnapshot(html`<sbb-checkbox checked>Label</sbb-checkbox>`, 'Checked - A11y tree');
});
