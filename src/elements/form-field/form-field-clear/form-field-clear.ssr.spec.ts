import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';
import type { SbbFormFieldElement } from '../form-field.js';

import { SbbFormFieldClearElement } from './form-field-clear.js';

import '../form-field.js';

describe(`sbb-form-field-clear ${fixture.name}`, () => {
  let root: SbbFormFieldElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-form-field>
        <label>Label</label>
        <input id="input" type="text" placeholder="Input placeholder" value="Input value" />
        <sbb-form-field-clear></sbb-form-field-clear>
      </sbb-form-field>`,
      { modules: ['../form-field.js', './form-field-clear.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root.querySelector('sbb-form-field-clear'), SbbFormFieldClearElement);
  });
});
