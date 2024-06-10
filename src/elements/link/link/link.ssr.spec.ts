import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbLinkElement } from './link.js';

describe(`sbb-link ${fixture.name}`, () => {
  let root: SbbLinkElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-link href="#" id="focus-id">Inline link</sbb-link>`, {
      modules: ['./link.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbLinkElement);
  });
});
