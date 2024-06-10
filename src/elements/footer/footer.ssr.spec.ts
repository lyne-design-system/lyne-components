import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbFooterElement } from './footer.js';

describe(`sbb-footer ${fixture.name}`, () => {
  let root: SbbFooterElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-footer></sbb-footer>`, { modules: ['./footer.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbFooterElement);
  });
});
