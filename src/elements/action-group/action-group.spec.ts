import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import type { SbbSecondaryButtonElement } from '../button.js';
import { fixture } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';
import type { SbbBlockLinkElement } from '../link.js';

import { SbbActionGroupElement } from './action-group.js';

import '../button/secondary-button.js';
import '../link/block-link.js';

describe(`sbb-action-group`, () => {
  let element: SbbActionGroupElement;
  let button: SbbSecondaryButtonElement;

  beforeEach(async () => {
    element = await fixture(html`
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
    `);

    button = element.querySelector<SbbSecondaryButtonElement>('sbb-secondary-button')!;
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbActionGroupElement);
  });

  describe('property sync', () => {
    it('should sync default size with sbb-secondary-button', async () => {
      expect(button.size).to.equal('l');
    });

    it('should update attributes with button-size="m"', async () => {
      element.setAttribute('button-size', 'm');
      await waitForLitRender(element);
      expect(button.size).to.equal('m');
    });

    it('should update attributes with link-size="s"', async () => {
      element.setAttribute('link-size', 's');
      await waitForLitRender(element);
      const link = element.querySelector<SbbBlockLinkElement>('sbb-block-link')!;
      expect(link.size).to.equal('s');
    });
  });
});
