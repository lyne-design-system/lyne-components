import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbAlertGroupElement } from './alert-group.js';

describe(`sbb-alert-group ${fixture.name}`, () => {
  let root: SbbAlertGroupElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-alert-group accessibility-title="Disruptions" accessibility-title-level="3">
          <sbb-alert title-content="Interruption" href="www.sbb.ch">First</sbb-alert>
          <sbb-alert title-content="Interruption" href="www.sbb.ch">Second</sbb-alert>
        </sbb-alert-group>
      `,
      { modules: ['./alert-group.js', '../alert.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbAlertGroupElement);
  });
});
