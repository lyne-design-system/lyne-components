import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTagGroupElement } from './tag-group.js';

import '../tag.js';

describe(`sbb-tag-group ${fixture.name}`, () => {
  let root: SbbTagGroupElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-tag-group multiple>
          <sbb-tag id="sbb-tag-1" value="tag1">Tag 1</sbb-tag>
          <sbb-tag id="sbb-tag-2" value="tag2">Tag 2</sbb-tag>
          <sbb-tag id="sbb-tag-3" value="tag3">Tag 3</sbb-tag>
        </sbb-tag-group>
      `,
      { modules: ['./tag-group.js', '../tag.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTagGroupElement);
  });
});
