import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import type { SbbLinkStaticElement } from './link-static';
import './link-static';

describe('sbb-link-static', () => {
  let element: SbbLinkStaticElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-link-static size="m"> Travelcards &amp; tickets. </sbb-link-static>`,
    );
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - ShadowDOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
