import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbBadgeElement } from './badge.js';

import './badge.js';

describe(`sbb-badge`, () => {
  it('should render with default values', async () => {
    const element: SbbBadgeElement = await fixture(html`<sbb-badge></sbb-badge>`);

    await expect(element).shadowDom.to.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-badge></sbb-badge>`);
});
