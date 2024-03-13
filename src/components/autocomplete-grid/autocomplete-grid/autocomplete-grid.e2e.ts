import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridElement } from './autocomplete-grid';

describe('sbb-autocomplete-grid', () => {
  let element: SbbAutocompleteGridElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid></sbb-autocomplete-grid>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridElement);
  });
});
