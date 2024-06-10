import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbExpansionPanelContentElement } from './expansion-panel-content.js';

describe(`sbb-expansion-panel-content ${fixture.name}`, () => {
  let root: SbbExpansionPanelContentElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-expansion-panel-content>Content</sbb-expansion-panel-content>`, {
      modules: ['./expansion-panel-content.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbExpansionPanelContentElement);
  });
});
