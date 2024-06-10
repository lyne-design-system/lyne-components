import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbHeaderElement } from './header.js';

describe(`sbb-header ${fixture.name}`, () => {
  let root: SbbHeaderElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-header></sbb-header>`, { modules: ['./header.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbHeaderElement);
  });
});
