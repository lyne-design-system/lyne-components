import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridActionsElement } from './autocomplete-grid-actions';

describe('sbb-autocomplete-grid-actions', () => {
  let element: SbbAutocompleteGridActionsElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-actions></sbb-autocomplete-grid-actions>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridActionsElement);
  });
});
