import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbCheckboxElement } from './checkbox.js';

describe(`sbb-checkbox ${fixture.name}`, () => {
  let root: SbbCheckboxElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-checkbox name="name" value="value">Label</sbb-checkbox>`, {
      modules: ['./checkbox.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbCheckboxElement);
  });
});
