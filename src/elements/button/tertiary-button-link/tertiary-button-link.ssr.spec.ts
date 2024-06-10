import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTertiaryButtonLinkElement } from './tertiary-button-link.js';

describe(`sbb-tertiary-button-link ${fixture.name}`, () => {
  let root: SbbTertiaryButtonLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-tertiary-button-link>Button</sbb-tertiary-button-link>`, {
      modules: ['./tertiary-button-link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTertiaryButtonLinkElement);
  });
});
