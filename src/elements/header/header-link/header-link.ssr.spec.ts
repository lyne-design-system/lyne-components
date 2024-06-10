import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbHeaderLinkElement } from './header-link.js';

describe(`sbb-header-link ${fixture.name}`, () => {
  let root: SbbHeaderLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-header-link id="focus-id" href="#">Action</sbb-header-link>`, {
      modules: ['./header-link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbHeaderLinkElement);
  });
});
