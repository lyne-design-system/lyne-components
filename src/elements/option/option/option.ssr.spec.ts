import { assert, expect } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbFormFieldElement } from '../../form-field.js';
import type { SbbSelectElement } from '../../select.js';

import { SbbOptionElement } from './option.js';

import '../../autocomplete.js';
import '../../form-field.js';
import '../../select.js';

describe(`sbb-option ${fixture.name}`, () => {
  describe('in a sbb-autocomplete', () => {
    let root: SbbFormFieldElement;

    beforeEach(async () => {
      root = await fixture(
        html`
          <sbb-form-field>
            <input />
            <sbb-autocomplete>
              <sbb-option id="option-1" value="1">Option 1</sbb-option>
              <sbb-option id="option-2" value="2">Option 2</sbb-option>
              <sbb-option id="option-3" value="3">Option 3</sbb-option>
            </sbb-autocomplete>
          </sbb-form-field>
        `,
        { modules: ['../../form-field.js', '../../autocomplete.js', './option.js'] },
      );
    });

    it('renders', () => {
      assert.instanceOf(root.querySelector('sbb-option'), SbbOptionElement);
    });
  });

  describe('in a sbb-select', () => {
    let root: SbbSelectElement;

    beforeEach(async () => {
      root = await fixture(
        html`
          <sbb-select>
            <sbb-option value="1">Option 1</sbb-option>
            <sbb-option value="2">Option 2</sbb-option>
            <sbb-option value="3">Option 3</sbb-option>
          </sbb-select>
        `,
        { modules: ['../../select.js', './option.js'] },
      );
    });

    it('renders', () => {
      assert.instanceOf(root.querySelector('sbb-option'), SbbOptionElement);
    });

    it('should have data-disable-highlight applied', () => {
      const options = root.querySelectorAll('sbb-option');
      expect(options.length).to.eq(3);
      for (const option of options) {
        expect(option).to.have.attribute('data-disable-highlight');
      }
    });
  });
});
