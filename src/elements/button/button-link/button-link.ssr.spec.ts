import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbButtonLinkElement } from './button-link.js';

describe(`sbb-button-link ${fixture.name}`, () => {
  let root: SbbButtonLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-button-link href="#">I am a link</sbb-button-link>`, {
      modules: ['./button-link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbButtonLinkElement);
  });
});
