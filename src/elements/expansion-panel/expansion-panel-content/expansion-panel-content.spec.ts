import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';

import { SbbExpansionPanelContentElement } from './expansion-panel-content.js';

describe(`sbb-expansion-panel-content`, () => {
  let element: SbbExpansionPanelContentElement;

  it('renders', async () => {
    element = await fixture(
      html`<sbb-expansion-panel-content>Content</sbb-expansion-panel-content>`,
    );
    assert.instanceOf(element, SbbExpansionPanelContentElement);
  });
});
