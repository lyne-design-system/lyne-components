import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbExpansionPanelHeaderElement } from './expansion-panel-header.js';

describe(`sbb-expansion-panel-header ${fixture.name}`, () => {
  let root: SbbExpansionPanelHeaderElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-expansion-panel-header>Header</sbb-expansion-panel-header>`, {
      modules: ['./expansion-panel-header.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbExpansionPanelHeaderElement);
  });
});
