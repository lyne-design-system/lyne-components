import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbExpansionPanelElement } from './expansion-panel.js';

import '../expansion-panel-header.js';
import '../expansion-panel-content.js';

describe(`sbb-expansion-panel ${fixture.name}`, () => {
  let root: SbbExpansionPanelElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-expansion-panel>
          <sbb-expansion-panel-header icon-name="dog-medium">Header</sbb-expansion-panel-header>
          <sbb-expansion-panel-content>Content</sbb-expansion-panel-content>
        </sbb-expansion-panel>
      `,
      {
        modules: [
          './expansion-panel.js',
          '../expansion-panel-header.js',
          '../expansion-panel-content.js',
        ],
      },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbExpansionPanelElement);
  });
});
