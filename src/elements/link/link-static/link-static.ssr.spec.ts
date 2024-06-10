import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbLinkStaticElement } from './link-static.js';

describe(`sbb-link-static ${fixture.name}`, () => {
  let root: SbbLinkStaticElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-link-static id="focus-id">Link static</sbb-link-static>`, {
      modules: ['./link-static.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbLinkStaticElement);
  });
});
