import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbSkiplinkListElement } from './skiplink-list.js';

import '../link/block-link.js';

describe(`sbb-skiplink-list ${fixture.name}`, () => {
  let root: SbbSkiplinkListElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-skiplink-list>
          <sbb-block-link href="#" id="link-1">Link 1</sbb-block-link>
          <sbb-block-link href="#" id="link-2">Link 2</sbb-block-link>
          <sbb-block-link href="#" id="link-3">Link 3</sbb-block-link>
        </sbb-skiplink-list>
        <button id="button">Focus me</button>
      `,
      { modules: ['./skiplink-list.js', '../link.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbSkiplinkListElement);
  });
});
