import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbAccordionElement } from './accordion.js';
import './accordion.js';
import '../expansion-panel.js';

describe(`sbb-accordion`, () => {
  let element: SbbAccordionElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-accordion>
        <sbb-expansion-panel>
          <sbb-expansion-panel-header>Header 1</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content 1</sbb-expansion-panel-content>
        </sbb-expansion-panel>
        <sbb-expansion-panel>
          <sbb-expansion-panel-header>Header 2</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content 2</sbb-expansion-panel-content>
        </sbb-expansion-panel>
      </sbb-accordion>
    `);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
