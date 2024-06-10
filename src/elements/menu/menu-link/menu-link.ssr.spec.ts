import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbMenuLinkElement } from './menu-link.js';

describe(`sbb-menu-link ${fixture.name}`, () => {
  let root: SbbMenuLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-menu-link href="#" id="focus-id">Menu Action</sbb-menu-link>`, {
      modules: ['./menu-link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbMenuLinkElement);
  });
});
