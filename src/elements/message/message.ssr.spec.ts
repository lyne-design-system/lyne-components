import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbMessageElement } from './message.js';

describe(`sbb-message ${fixture.name}`, () => {
  let root: SbbMessageElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-message></sbb-message>`, { modules: ['./message.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbMessageElement);
  });
});
