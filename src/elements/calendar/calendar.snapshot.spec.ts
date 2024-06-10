import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import './calendar.js';

describe(`sbb-calendar`, () => {
  it('renders', async () => {
    const root = await fixture(
      html`<sbb-calendar selected="2023-01-20T00:00:00" now="2023-01-04T00:00:00"></sbb-calendar>`,
    );

    expect(root).dom.to.be.equal(
      `<sbb-calendar now="2023-01-04T00:00:00" selected="2023-01-20T00:00:00"></sbb-calendar>`,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(
    html`<sbb-calendar now="2023-01-04T00:00:00" selected="2023-01-20T00:00:00"></sbb-calendar>`,
    undefined,
    { safari: true }, // We skip safari because it has an inconsistent behavior on ci environment
  );
});
