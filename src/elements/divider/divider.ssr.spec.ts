import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbDividerElement } from './divider.js';

describe(`sbb-divider ${fixture.name}`, () => {
  let root: SbbDividerElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-divider></sbb-divider>`, {
      modules: ['./divider.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDividerElement);
  });
});
