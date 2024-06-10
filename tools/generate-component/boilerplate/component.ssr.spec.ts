import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { __nameUpperCase__ } from './__noPrefixName__.js';

describe(`__name__ ${fixture.name}`, () => {
  it('renders', () => {
    let root: __nameUpperCase__;

    beforeEach(async () => {
      root = await fixture(html`<__name__ my-prop="Label"></__name__>`, {
        modules: ['./__noPrefixName__.js'],
      });
    });

    it('renders', () => {
      assert.instanceOf(root, __nameUpperCase__);
    });
  });
});
