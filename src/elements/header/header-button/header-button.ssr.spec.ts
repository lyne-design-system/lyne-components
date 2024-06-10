import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbHeaderButtonElement } from './header-button.js';

describe(`sbb-header-button ${fixture.name}`, () => {
  let root: SbbHeaderButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-header-button id="focus-id">Action</sbb-header-button>`, {
      modules: ['./header-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbHeaderButtonElement);
  });
});
