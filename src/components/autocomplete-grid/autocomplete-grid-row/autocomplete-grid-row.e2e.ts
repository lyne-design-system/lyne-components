import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridRowElement } from './autocomplete-grid-row';

describe('sbb-autocomplete-grid-row', () => {
  let element: SbbAutocompleteGridRowElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-row></sbb-autocomplete-grid-row>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridRowElement);
  });
});
