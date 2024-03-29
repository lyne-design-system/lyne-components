import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom';
import { describeIf } from '../../core/testing';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private';

import type { SbbOptGroupElement } from './optgroup';
import '../../autocomplete';
import '../option';
import './optgroup';

describe(`sbb-optgroup`, () => {
  describe('autocomplete', () => {
    describe('renders', () => {
      let elem: SbbOptGroupElement;

      beforeEach(async () => {
        const testFixture = await fixture(html`
          <div>
            <sbb-autocomplete origin="anchor">
              <sbb-optgroup label="Label">
                <sbb-option value="1">1</sbb-option>
                <sbb-option value="2">2</sbb-option>
              </sbb-optgroup>
            </sbb-autocomplete>
            <div id="anchor"></div>
          </div>
        `);
        elem = testFixture.querySelector('sbb-optgroup')!;
      });

      describeIf(!isSafari(), 'Chrome-Firefox', async () => {
        it('Dom', async () => {
          await expect(elem).dom.to.be.equalSnapshot();
        });

        it('ShadowDom', async () => {
          await expect(elem).shadowDom.to.be.equalSnapshot();
        });
      });

      describeIf(isSafari(), 'Safari', async () => {
        it('Dom', async () => {
          await expect(elem).dom.to.be.equalSnapshot();
        });

        it('ShadowDom', async () => {
          await expect(elem).shadowDom.to.be.equalSnapshot();
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

      describeIf(!isSafari(), 'Chrome-Firefox', async () => {
        it('Dom', async () => {
          await expect(elem).dom.to.be.equalSnapshot();
        });

        it('ShadowDom', async () => {
          await expect(elem).shadowDom.to.be.equalSnapshot();
        });
      });

      describeIf(isSafari(), 'Safari', async () => {
        it('Dom', async () => {
          await expect(elem).dom.to.be.equalSnapshot();
        });

        it('ShadowDom', async () => {
          await expect(elem).shadowDom.to.be.equalSnapshot();
        });
      });
    });
  });
});
