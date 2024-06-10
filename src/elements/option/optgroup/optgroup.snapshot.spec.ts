import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom.js';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { describeIf } from '../../core/testing.js';

import type { SbbOptGroupElement } from './optgroup.js';

import '../../autocomplete.js';
import '../option.js';
import './optgroup.js';

describe(`sbb-optgroup`, () => {
  describe('autocomplete', () => {
    describe('renders', () => {
      let element: SbbOptGroupElement;

      beforeEach(async () => {
        const testFixture = await fixture(html`
          <div>
            <input id="input" />
            <sbb-autocomplete origin="anchor" trigger="input">
              <sbb-optgroup label="Label">
                <sbb-option value="1">1</sbb-option>
                <sbb-option value="2">2</sbb-option>
              </sbb-optgroup>
            </sbb-autocomplete>
            <div id="anchor"></div>
          </div>
        `);
        element = testFixture.querySelector('sbb-optgroup')!;

        // Open input for a meaningful a11y tree
        testFixture.querySelector<HTMLInputElement>('input')!.focus();
      });

      describeIf(!isSafari, 'Chrome-Firefox', async () => {
        it('DOM', async () => {
          await expect(element).dom.to.be.equalSnapshot();
        });

        it('Shadow DOM', async () => {
          await expect(element).shadowDom.to.be.equalSnapshot();
        });
      });

      describeIf(isSafari, 'Safari', async () => {
        it('DOM', async () => {
          await expect(element).dom.to.be.equalSnapshot();
        });

        it('Shadow DOM', async () => {
          await expect(element).shadowDom.to.be.equalSnapshot();
        });
      });

      testA11yTreeSnapshot();
    });

    describe('renders disabled', () => {
      let elem: SbbOptGroupElement;

      beforeEach(async () => {
        const testFixture = await fixture(html`
          <div>
            <sbb-autocomplete origin="anchor">
              <sbb-optgroup label="Label" disabled>
                <sbb-option value="1">1</sbb-option>
                <sbb-option value="2">2</sbb-option>
              </sbb-optgroup>
            </sbb-autocomplete>
            <div id="anchor"></div>
          </div>
        `);
        elem = testFixture.querySelector('sbb-optgroup')!;
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
    });
  });
});
