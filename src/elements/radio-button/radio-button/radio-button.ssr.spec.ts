import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbRadioButtonElement } from './radio-button.js';

describe(`sbb-radio-button ${fixture.name}`, () => {
  let root: SbbRadioButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-radio-button value="Value">Value label</sbb-radio-button>`, {
      modules: ['./radio-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbRadioButtonElement);
  });
});
