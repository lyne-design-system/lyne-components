import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private';

import { SbbAutocompleteGridActionsElement } from './autocomplete-grid-actions';

describe('sbb-autocomplete-grid-actions', () => {
  let element: SbbAutocompleteGridActionsElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-autocomplete-grid-actions></sbb-autocomplete-grid-actions>`, {
      modules: ['./autocomplete-grid-actions.ts'],
    });
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridActionsElement);
  });
});
