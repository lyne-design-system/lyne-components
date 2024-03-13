import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbAutocompleteGridOptgroupElement } from './autocomplete-grid-optgroup';

describe('sbb-autocomplete-grid-optgroup', () => {
  let element: SbbAutocompleteGridOptgroupElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-autocomplete-grid-optgroup></sbb-autocomplete-grid-optgroup>`,
    );
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridOptgroupElement);
  });
});
