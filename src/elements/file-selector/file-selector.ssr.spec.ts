import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbFileSelectorElement } from './file-selector.js';

describe(`sbb-file-selector ${fixture.name}`, () => {
  let root: SbbFileSelectorElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-file-selector></sbb-file-selector>`, {
      modules: ['./file-selector.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbFileSelectorElement);
  });
});
