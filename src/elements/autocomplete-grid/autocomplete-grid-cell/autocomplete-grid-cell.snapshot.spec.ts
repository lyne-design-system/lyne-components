import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbAutocompleteGridCellElement } from './autocomplete-grid-cell.js';
import '../autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import './autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';

describe('sbb-autocomplete-grid-cell', () => {
  describe('renders', () => {
    let root: SbbAutocompleteGridCellElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-autocomplete-grid origin="anchor">
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-cell>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-cell>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
          <div id="anchor"></div>
        `)
      ).querySelector('sbb-autocomplete-grid-cell')!;
    });

    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(html`
      <sbb-autocomplete-grid-cell>
        <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-cell>
    `);
  });
});
