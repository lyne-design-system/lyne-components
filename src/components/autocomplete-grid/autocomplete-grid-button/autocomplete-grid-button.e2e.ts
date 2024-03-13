import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridButtonElement } from './autocomplete-grid-button';

describe('sbb-autocomplete-grid-button', () => {
  let element: SbbAutocompleteGridButtonElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-button></sbb-autocomplete-grid-button>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridButtonElement);
  });
});
