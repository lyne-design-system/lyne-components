import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom.js';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { describeIf } from '../../core/testing.js';
import type { SbbFormFieldElement } from '../../form-field.js';

import type { SbbAutocompleteGridElement } from './autocomplete-grid.js';
import './autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-option.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';
import '../../form-field/form-field/form-field.js';

describe('sbb-autocomplete-grid', () => {
  let root: SbbFormFieldElement;
  let element: SbbAutocompleteGridElement;

  beforeEach(async () => {
    root = await fixture(html`
      <sbb-form-field>
        <input />
        <sbb-autocomplete-grid>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option>Option 1</sbb-autocomplete-grid-option>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button icon-name="dog-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option>Option 2</sbb-autocomplete-grid-option>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button icon-name="dog-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid>
      </sbb-form-field>
    `);
    element = root.querySelector('sbb-autocomplete-grid')!;
  });

  describeIf(!isSafari, 'Chrome-Firefox', async () => {
    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  describeIf(isSafari, 'Safari', async () => {
    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });
});
