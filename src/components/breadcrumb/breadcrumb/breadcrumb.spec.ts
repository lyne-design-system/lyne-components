import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';

import './breadcrumb';

describe('sbb-breadcrumb', () => {
  it('renders with text', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="/test" target="_blank" download rel="subsection"
        >Breadcrumb</sbb-breadcrumb
      >
    `);

    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        role="link"
        tabindex="0"
        href="/test"
        target="_blank"
        download
        rel="subsection"
        id="sbb-breadcrumb-1">
        Breadcrumb
      </sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('renders with icon', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="/" icon-name="house-small"></sbb-breadcrumb>
    `);

    await waitForLitRender(root);
    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        role="link"
        tabindex="0"
        href="/"
        icon-name="house-small"
        id="sbb-breadcrumb-2"></sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('renders with icon and text', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="/" icon-name="house-small">Home</sbb-breadcrumb>
    `);

    await waitForLitRender(root);
    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        role="link"
        tabindex="0"
        href="/"
        icon-name="house-small"
        id="sbb-breadcrumb-3">
        Home
      </sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('renders as span if no href is provided', async () => {
    const root = await fixture(html`<sbb-breadcrumb>Breadcrumb</sbb-breadcrumb>`);

    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb dir="ltr" id="sbb-breadcrumb-4">
        Breadcrumb
      </sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });
});
