import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbAutocompleteElement } from './autocomplete.js';

import '../form-field.js';
import '../option.js';

describe(`sbb-autocomplete ${fixture.name}`, () => {
  let root: SbbAutocompleteElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete id="myAutocomplete">
            <sbb-option id="option-1" value="1">1</sbb-option>
            <sbb-option id="option-2" value="2">2</sbb-option>
            <sbb-option id="option-3" value="3">3</sbb-option>
          </sbb-autocomplete>
        </sbb-form-field>
        <button>Use this for backdrop click</button>
      `,
      { modules: ['../form-field.js', './autocomplete.js', '../option.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-autocomplete'), SbbAutocompleteElement);
  });
});
