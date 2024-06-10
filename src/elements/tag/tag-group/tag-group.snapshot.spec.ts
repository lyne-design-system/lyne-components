import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbTagGroupElement } from './tag-group.js';
import './tag-group.js';
import '../tag.js';

describe(`sbb-tag-group`, () => {
  let element: SbbTagGroupElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-tag-group>
        <sbb-tag value="tag-1">First tag</sbb-tag>
        <sbb-tag value="tag-2">Second tag</sbb-tag>
        <div></div>
        <sbb-tag value="tag-3">Third tag</sbb-tag>
      </sbb-tag-group>
    `);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
