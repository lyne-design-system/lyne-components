import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbBlockLinkStaticElement } from './block-link-static.js';
import './block-link-static.js';
import '../../icon.js';

describe(`sbb-block-link-static`, () => {
  let element: SbbBlockLinkStaticElement;

  beforeEach(async () => {
    element = await fixture(
      html` <sbb-block-link-static icon-placement="end" size="m">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="chevron-small-right-small"
          role="img"
          slot="icon"
        ></sbb-icon>
        Travelcards &amp; tickets.
      </sbb-block-link-static>`,
    );
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
