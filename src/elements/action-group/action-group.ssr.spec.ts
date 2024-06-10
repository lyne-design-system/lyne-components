import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbActionGroupElement } from './action-group.js';

import '../button.js';
import '../link.js';

describe(`sbb-action-group ${fixture.name}`, () => {
  let root: SbbActionGroupElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-action-group align-group="start" orientation="horizontal">
          <sbb-secondary-button>Button</sbb-secondary-button>
          <sbb-block-link
            icon-name="chevron-small-left-small"
            icon-placement="start"
            href="https://github.com/sbb-design-systems/lyne-components"
          >
            Link
          </sbb-block-link>
        </sbb-action-group>
      `,
      { modules: ['./action-group.js', '../button.js', '../link.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbActionGroupElement);
  });
});
