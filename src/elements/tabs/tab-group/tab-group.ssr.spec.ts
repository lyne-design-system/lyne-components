import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTabGroupElement } from './tab-group.js';
import '../tab-title.js';

describe(`sbb-tab-group ${fixture.name}`, () => {
  let root: SbbTabGroupElement;

  beforeEach(async () => {
    root = await fixture(
      html` <sbb-tab-group initial-selected-index="1">
        <sbb-tab-title id="sbb-tab-1">Test tab label 1</sbb-tab-title>
        <div>Test tab content 1</div>
        <sbb-tab-title id="sbb-tab-2">Test tab label 2</sbb-tab-title>
        <div>Test tab content 2</div>
        <sbb-tab-title id="sbb-tab-3" disabled>Test tab label 3</sbb-tab-title>
        <div>Test tab content 3</div>
        <sbb-tab-title id="sbb-tab-4">Test tab label 4</sbb-tab-title>
      </sbb-tab-group>`,
      { modules: ['./tab-group.js', '../tab-title.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTabGroupElement);
  });
});
