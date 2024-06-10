import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbTabGroupElement } from './tab-group.js';
import './tab-group.js';
import '../tab-title.js';

describe(`sbb-tab-group`, () => {
  let element: SbbTabGroupElement;

  describe('renders', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-tab-group initial-selected-index="0">
          <sbb-tab-title>Test tab label 1</sbb-tab-title>
          <div>Test tab content 1</div>
          <sbb-tab-title>Test tab label 2</sbb-tab-title>
          <div>Test tab content 2</div>
          <sbb-tab-title disabled>Test tab label 3</sbb-tab-title>
          <div>Test tab content 3</div>
          <sbb-tab-title>Test tab label 4</sbb-tab-title>
        </sbb-tab-group>`,
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
