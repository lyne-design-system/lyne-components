import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbButtonStaticElement } from './button-static.js';

describe(`sbb-button-static ${fixture.name}`, () => {
  let root: SbbButtonStaticElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-button-static>I am a static button</sbb-button-static>`, {
      modules: ['./button-static.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbButtonStaticElement);
  });
});
