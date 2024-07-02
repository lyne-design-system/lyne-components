import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbAutocompleteGridOptionElement } from './autocomplete-grid-option.js';
import '../autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import './autocomplete-grid-option.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';

describe('sbb-autocomplete-grid-option', () => {
  describe('default', () => {
    let root: SbbAutocompleteGridOptionElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-autocomplete-grid origin="anchor">
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
          <div id="anchor"></div>
        `)
      ).querySelector('sbb-autocomplete-grid-option')!;
    });

    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(
    html`<sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>`,
  );

  describe('disabled', () => {
    let root: SbbAutocompleteGridOptionElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-autocomplete-grid origin="anchor">
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option value="1" disabled
                >Option 1</sbb-autocomplete-grid-option
              >
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
          <div id="anchor"></div>
        `)
      ).querySelector('sbb-autocomplete-grid-option')!;
    });

    it('DOM', async () => {
      await expect(root).to.have.attribute('disabled');
      await expect(root).to.have.attribute('aria-disabled', 'true');
    });
  });
});
