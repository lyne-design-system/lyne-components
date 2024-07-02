import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import type { SbbFormFieldElement } from '../../form-field.js';

import { SbbAutocompleteGridOptionElement } from './autocomplete-grid-option.js';
import '../../form-field.js';
import '../autocomplete-grid.js';
import '../autocomplete-grid-optgroup.js';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';

describe(`sbb-autocomplete-grid-option ssr`, () => {
  let element: SbbFormFieldElement;

  beforeEach(async () => {
    element = await fixture(
      html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete-grid>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option>Option 1</sbb-autocomplete-grid-option>
              <sbb-autocomplete-grid-cell>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-cell>
            </sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option>Option 2</sbb-autocomplete-grid-option>
              <sbb-autocomplete-grid-cell>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-cell>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
        </sbb-form-field>
      `,
      { modules: ['../../autocomplete-grid.ts', '../../form-field.ts'] },
    );
  });

  it('renders', async () => {
    const option = element.querySelector('sbb-autocomplete-grid-option')!;
    assert.instanceOf(option, SbbAutocompleteGridOptionElement);
  });
});
