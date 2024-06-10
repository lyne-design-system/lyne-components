import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbExpansionPanelElement } from './expansion-panel.js';

import './expansion-panel.js';
import '../expansion-panel-header.js';
import '../expansion-panel-content.js';

describe(`sbb-expansion-panel`, () => {
  describe('renders', () => {
    let element: SbbExpansionPanelElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-expansion-panel>
          <sbb-expansion-panel-header>Header</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content</sbb-expansion-panel-content>
        </sbb-expansion-panel>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders size s', () => {
    let element: SbbExpansionPanelElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-expansion-panel size="s">
          <sbb-expansion-panel-header>Header</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content</sbb-expansion-panel-content>
        </sbb-expansion-panel>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders with level set', () => {
    let element: SbbExpansionPanelElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-expansion-panel title-level="4">
          <sbb-expansion-panel-header>Header</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content</sbb-expansion-panel-content>
        </sbb-expansion-panel>
      `);
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
