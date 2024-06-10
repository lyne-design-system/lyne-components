import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbToggleOptionElement } from './toggle-option.js';

describe(`sbb-toggle-option ${fixture.name}`, () => {
  let root: SbbToggleOptionElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-toggle-option value="Value">Value label</sbb-toggle-option>`, {
      modules: ['./toggle-option.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbToggleOptionElement);
  });
});
