import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import './step-label';

describe('sbb-step-label', () => {
  it('renders', async () => {
    const root = await fixture(html`<sbb-step-label>Label</sbb-step-label>`);

    expect(root).dom.to.be.equal(`
        <sbb-step-label
            data-action
            data-button
            dir="ltr"
            id="sbb-step-label-0"
            role="tab"
            slot="step-label"
            tabindex="0"
        >Label</sbb-step-label>
    `);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with icon', async () => {
    const root = await fixture(html`<sbb-step-label icon-name="tick-small">Label</sbb-step-label>`);

    expect(root).dom.to.be.equal(`
        <sbb-step-label
            data-action
            data-button
            dir="ltr"
            icon-name="tick-small"
            id="sbb-step-label-1"
            role="tab"
            slot="step-label"
            tabindex="0"
        >Label</sbb-step-label>
    `);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders disabled', async () => {
    const root = await fixture(html`<sbb-step-label disabled>Label</sbb-step-label>`);

    expect(root).dom.to.be.equal(`
        <sbb-step-label
            aria-disabled="true"
            data-action
            data-button
            dir="ltr"
            disabled
            id="sbb-step-label-2"
            role="tab"
            slot="step-label"
        >Label</sbb-step-label>
    `);
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-step-label>Label</sbb-step-label>`);
});
