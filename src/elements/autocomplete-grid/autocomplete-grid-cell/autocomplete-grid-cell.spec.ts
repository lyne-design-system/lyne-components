import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import { SbbAutocompleteGridCellElement } from './autocomplete-grid-cell.js';

describe('sbb-autocomplete-grid-cell', () => {
  let element: SbbAutocompleteGridCellElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-cell></sbb-autocomplete-grid-cell>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridCellElement);
  });
});
