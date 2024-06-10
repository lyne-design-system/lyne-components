import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbNavigationLinkElement } from './navigation-link.js';

describe(`sbb-navigation-link ${fixture.name}`, () => {
  let root: SbbNavigationLinkElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-navigation-link href="#" id="focus-id">Navigation Action</sbb-navigation-link>`,
      { modules: ['./navigation-link.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbNavigationLinkElement);
  });
});
