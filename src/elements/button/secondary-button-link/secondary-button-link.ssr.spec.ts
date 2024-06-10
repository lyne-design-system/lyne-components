import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbSecondaryButtonLinkElement } from './secondary-button-link.js';

describe(`sbb-secondary-button-link ${fixture.name}`, () => {
  let root: SbbSecondaryButtonLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-secondary-button-link>Button</sbb-secondary-button-link>`, {
      modules: ['./secondary-button-link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbSecondaryButtonLinkElement);
  });
});
