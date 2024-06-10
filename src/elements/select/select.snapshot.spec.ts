import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../core/dom.js';
import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';
import { describeIf } from '../core/testing.js';

import type { SbbSelectElement } from './select.js';
import './select.js';
import '../option.js';

describe(`sbb-select`, () => {
  describe('renders', () => {
    let elem: SbbSelectElement;

    beforeEach(async () => {
      elem = await fixture(html`
        <sbb-select>
          <sbb-option value="1">Option 1</sbb-option>
          <sbb-option value="2">Option 2</sbb-option>
          <sbb-option value="3">Option 3</sbb-option>
        </sbb-select>
      `);
    });

    describeIf(!isSafari, 'Chrome-Firefox', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    describeIf(isSafari, 'Safari', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    testA11yTreeSnapshot();
  });

  describe('renders multiple', () => {
    let elem: SbbSelectElement;

    beforeEach(async () => {
      elem = await fixture(html`
        <sbb-select multiple>
          <sbb-option value="1">Option 1</sbb-option>
          <sbb-option value="2">Option 2</sbb-option>
          <sbb-option value="3">Option 3</sbb-option>
        </sbb-select>
      `);
    });

    describeIf(!isSafari, 'Chrome-Firefox', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    describeIf(isSafari, 'Safari', async () => {
      it('DOM', async () => {
        await expect(elem).dom.to.be.equalSnapshot();
      });

      it('Shadow DOM', async () => {
        await expect(elem).shadowDom.to.be.equalSnapshot();
      });
    });

    testA11yTreeSnapshot();
  });
});
