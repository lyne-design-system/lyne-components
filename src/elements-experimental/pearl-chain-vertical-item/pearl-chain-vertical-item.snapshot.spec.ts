import { expect } from '@open-wc/testing';
import { fixture } from '@sbb-esta/lyne-elements/core/testing/private.js';
import { waitForLitRender } from '@sbb-esta/lyne-elements/core/testing.js';
import { html } from 'lit/static-html.js';

import type { LineColor, SbbPearlChainVerticalItemElement } from './pearl-chain-vertical-item.js';

import './pearl-chain-vertical-item.js';

describe(`sbb-pearl-chain-vertical-item`, () => {
  it('renders component with charcoal standard line and bullet', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item></sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'default',
      bulletType: 'default',
      minHeight: 100,
      hideLine: false,
      bulletSize: 'start-end',
      position: 0,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column  sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__line sbb-pearl-chain-vertical-item__line--default sbb-pearl-chain-vertical-item__line--standard" style="--sbb-pearl-chain-vertical-item-leg-status:0%;"></div>
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--default sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders component with red line and bullet', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item> </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'disruption',
      bulletType: 'default',
      minHeight: 100,
      hideLine: false,
      bulletSize: 'start-end',
      position: 0,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__line sbb-pearl-chain-vertical-item__line--disruption sbb-pearl-chain-vertical-item__line--standard" style="--sbb-pearl-chain-vertical-item-leg-status:0%;"></div>
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--default sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders component with left slot', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item>
        <div slot="left">content</div>
      </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'dotted',
      lineColor: 'charcoal' as LineColor,
      bulletType: 'default',
      minHeight: 100,
      bulletSize: 'start-end',
      hideLine: true,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
        <div slot="left">content</div>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--default sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders component with right slot', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
      </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'disruption',
      bulletType: 'past',
      minHeight: 100,
      bulletSize: 'start-end',
      hideLine: true,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--past sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders component with both slots', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'disruption',
      bulletType: 'past',
      minHeight: 100,
      bulletSize: 'start-end',
      hideLine: true,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--past sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders a position', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'disruption',
      bulletType: 'default',
      minHeight: 100,
      hideLine: true,
      bulletSize: 'start-end',
      position: 50,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
      <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--past sbb-pearl-chain-vertical-item__bullet--start-end"></div>
        <div class="sbb-pearl-chain-vertical-item__bullet--position" style="--sbb-pearl-chain-vertical-item-position:50%;"></div>
      </div>
      <slot name="right"></slot>
    `);
  });

  it('renders a crossed-bullet', async () => {
    const element = await fixture<SbbPearlChainVerticalItemElement>(html`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);

    element.pearlChainVerticalItemAttributes = {
      lineType: 'standard',
      lineColor: 'disruption',
      bulletType: 'skipped',
      minHeight: 100,
      hideLine: true,
      bulletSize: 'start-end',
      position: 0,
    };
    await waitForLitRender(element);
    expect(element).dom.to.be.equal(`
      <sbb-pearl-chain-vertical-item>
        <div slot="right">right content</div>
        <div slot="left">left content</div>
      </sbb-pearl-chain-vertical-item>
    `);
    expect(element).shadowDom.to.be.equal(`
      <div class="sbb-pearl-chain-vertical-item__column" style="height: 100px;">
        <slot name="left"></slot>
      </div>
      <div class="sbb-pearl-chain-vertical-item__column sbb-pearl-chain-vertical-item__column--middle" aria-hidden="true">
        <div class="sbb-pearl-chain-vertical-item__bullet sbb-pearl-chain-vertical-item__bullet--skipped sbb-pearl-chain-vertical-item__bullet--start-end"></div>
      </div>
      <slot name="right"></slot>
    `);
  });
});
