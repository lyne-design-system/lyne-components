import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbStepLabelElement } from './step-label.js';

import './step-label.js';

describe('sbb-step-label', () => {
  let root: SbbStepLabelElement;

  describe('renders', async () => {
    beforeEach(async () => {
      root = await fixture(html`<sbb-step-label>Label</sbb-step-label>`);
    });

    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders with icon', async () => {
    beforeEach(async () => {
      root = await fixture(html`<sbb-step-label icon-name="tick-small">Label</sbb-step-label>`);
    });

    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders disabled', async () => {
    beforeEach(async () => {
      root = await fixture(html`<sbb-step-label disabled>Label</sbb-step-label>`);
    });

    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(html`<sbb-step-label>Label</sbb-step-label>`);
});
