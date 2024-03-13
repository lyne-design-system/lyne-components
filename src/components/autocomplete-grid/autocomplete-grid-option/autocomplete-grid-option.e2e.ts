import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridOptionElement } from './autocomplete-grid-option';

describe('sbb-autocomplete-grid-option', () => {
  let element: SbbAutocompleteGridOptionElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-option></sbb-autocomplete-grid-option>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridOptionElement);
  });
});
