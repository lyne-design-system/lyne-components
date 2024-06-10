import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbMenuButtonElement } from './menu-button.js';

describe(`sbb-menu-button ${fixture.name}`, () => {
  let root: SbbMenuButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-menu-button id="focus-id">Menu Action</sbb-menu-button>`, {
      modules: ['./menu-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbMenuButtonElement);
  });
});
