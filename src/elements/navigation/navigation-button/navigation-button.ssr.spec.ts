import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbNavigationButtonElement } from './navigation-button.js';

describe(`sbb-navigation-button ${fixture.name}`, () => {
  let root: SbbNavigationButtonElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-navigation-button id="focus-id">Navigation Action</sbb-navigation-button>`,
      { modules: ['./navigation-button.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbNavigationButtonElement);
  });
});
