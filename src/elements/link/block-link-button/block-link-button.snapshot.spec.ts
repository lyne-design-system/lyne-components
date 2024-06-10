import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbBlockLinkButtonElement } from './block-link-button.js';

import '../../icon.js';
import './block-link-button.js';

describe(`sbb-block-link-button`, () => {
  let element: SbbBlockLinkButtonElement;

  beforeEach(async () => {
    element = await fixture(
      html` <sbb-block-link-button
        icon-placement="end"
        size="m"
        negative
        name="name"
        type="submit"
        form="formid"
      >
        <sbb-icon name="chevron-small-right-small" slot="icon"></sbb-icon>
        Travelcards &amp; tickets.
      </sbb-block-link-button>`,
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
