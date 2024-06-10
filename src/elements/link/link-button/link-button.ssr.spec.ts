import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbLinkButtonElement } from './link-button.js';

describe(`sbb-link-button ${fixture.name}`, () => {
  let root: SbbLinkButtonElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-link-button id="focus-id">Link as Button</sbb-link-button>`, {
      modules: ['./link-button.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbLinkButtonElement);
  });
});
