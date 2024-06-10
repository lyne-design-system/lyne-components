import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbContainerElement } from './container.js';

describe(`sbb-container ${fixture.name}`, () => {
  let root: SbbContainerElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-container></sbb-container>`, { modules: ['./container.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbContainerElement);
  });
});
