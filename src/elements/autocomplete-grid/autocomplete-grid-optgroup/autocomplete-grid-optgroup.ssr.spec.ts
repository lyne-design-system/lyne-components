import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import { SbbAutocompleteGridOptgroupElement } from './autocomplete-grid-optgroup.js';
import '../autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';
import '../autocomplete-grid-option.js';

describe(`sbb-autocomplete-grid-optgroup ssr`, () => {
  let element: SbbAutocompleteGridOptgroupElement;

  beforeEach(async () => {
    element = await fixture(
      html`
        <sbb-autocomplete-grid-optgroup label="Group 1">
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-1" value="1"
              >Option 1
            </sbb-autocomplete-grid-option>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button
                icon-name="pen-small"
                id="button-1"
              ></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-2" value="2" disabled
              >Option 2
            </sbb-autocomplete-grid-option>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-3" value="3"
              >Option 3
            </sbb-autocomplete-grid-option>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid-optgroup>
      `,
      { modules: ['../../autocomplete-grid.ts'] },
    );
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridOptgroupElement);
  });
});
