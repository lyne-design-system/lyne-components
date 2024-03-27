import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForCondition } from '../core/testing';
import { fixture, testA11yTreeSnapshot } from '../core/testing/private';

import './notification';

describe(`sbb-notification`, () => {
  it('renders', async () => {
    const root = await fixture(
      html`<sbb-notification>The quick brown fox jumps over the lazy dog.</sbb-notification>`,
    );
    await waitForCondition(() => root.getAttribute('data-state') === 'opened');

    expect(root).dom.to.be.equal(
      `
      <sbb-notification data-state="opened" type="info" data-slot-names="unnamed" data-resize-disable-animation>
        The quick brown fox jumps over the lazy dog.
      </sbb-notification>`,
      { ignoreAttributes: ['style'] },
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with a title', async () => {
    const root = await fixture(
      html`<sbb-notification title-content="Title"
        >The quick brown fox jumps over the lazy dog.</sbb-notification
      >`,
    );
    await waitForCondition(() => root.getAttribute('data-state') === 'opened');

    expect(root).dom.to.be.equal(
      `
      <sbb-notification data-state="opened" title-content="Title" type="info" data-slot-names="unnamed" data-resize-disable-animation>
        The quick brown fox jumps over the lazy dog.
      </sbb-notification>`,
      { ignoreAttributes: ['style'] },
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders with a slotted title', async () => {
    const root = await fixture(
      html`<sbb-notification
        ><span slot="title">Slotted title</span>
        The quick brown fox jumps over the lazy dog.
      </sbb-notification>`,
    );
    await waitForCondition(() => root.getAttribute('data-state') === 'opened');

    expect(root).dom.to.be.equal(
      `
      <sbb-notification data-state="opened" type="info" data-slot-names="title unnamed" data-resize-disable-animation>
        <span slot="title">
          Slotted title
        </span>
        The quick brown fox jumps over the lazy dog.
      </sbb-notification>`,
      { ignoreAttributes: ['style'] },
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('renders without the close button', async () => {
    const root = await fixture(
      html`<sbb-notification title-content="Title" readonly
        >The quick brown fox jumps over the lazy dog.</sbb-notification
      >`,
    );
    await waitForCondition(() => root.getAttribute('data-state') === 'opened');

    expect(root).dom.to.be.equal(
      `
      <sbb-notification readonly data-state="opened" title-content="Title" type="info" data-slot-names="unnamed" data-resize-disable-animation>
        The quick brown fox jumps over the lazy dog.
      </sbb-notification>`,
      { ignoreAttributes: ['style'] },
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(
    html`<sbb-notification title-content="Test title">Lorem ipsum ...</sbb-notification>`,
  );
});
