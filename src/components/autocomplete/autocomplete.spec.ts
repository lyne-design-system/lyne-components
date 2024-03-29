import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../core/dom';
import { describeIf } from '../core/testing';
import { fixture, testA11yTreeSnapshot } from '../core/testing/private';
import type { SbbFormFieldElement } from '../form-field';

import type { SbbAutocompleteElement } from './autocomplete';
import '../form-field';
import '../option';
import './autocomplete';

describe(`sbb-autocomplete`, () => {
  describe('renders standalone', async () => {
    let element: SbbAutocompleteElement;

    beforeEach(async () => {
      const testFixture = await fixture(
        html`<div>
          <div id="origin"></div>
          <input id="trigger" />
          <sbb-autocomplete origin="origin" trigger="trigger">
            <sbb-option value="1">1</sbb-option>
            <sbb-option value="2">2</sbb-option>
          </sbb-autocomplete>
        </div> `,
      );
      element = testFixture.querySelector('sbb-autocomplete')!;
    });

    describeIf(!isSafari(), 'Chrome-Firefox', async () => {
      it('Dom', async () => {
        await expect(element).dom.to.be.equalSnapshot();
      });

      it('ShadowDom', async () => {
        await expect(element).shadowDom.to.be.equalSnapshot();
      });
    });

    describeIf(isSafari(), 'Safari', async () => {
      it('Dom', async () => {
        await expect(element).dom.to.be.equalSnapshot();
      });

      it('ShadowDom', async () => {
        await expect(element).shadowDom.to.be.equalSnapshot();
      });
    });
  });

  describe('renders in form field', async () => {
    let root: SbbFormFieldElement;

    beforeEach(async () => {
      root = await fixture(html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete>
            <sbb-option value="1">1</sbb-option>
            <sbb-option value="2">2</sbb-option>
          </sbb-autocomplete>
        </sbb-form-field>
      `);
    });

    describeIf(!isSafari(), 'Chrome-Firefox', async () => {
      it('Dom', async () => {
        await expect(root).dom.to.be.equalSnapshot();
      });

      it('ShadowDom', async () => {
        await expect(root).shadowDom.to.be.equalSnapshot();
      });
    });

    describeIf(isSafari(), 'Safari', async () => {
      it('Dom', async () => {
        await expect(root).dom.to.be.equalSnapshot();
      });

      it('ShadowDom', async () => {
        await expect(root).shadowDom.to.be.equalSnapshot();
      });
    });

    testA11yTreeSnapshot();
  });
});
