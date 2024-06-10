import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import type { SbbNotificationElement } from './notification.js';
import './notification.js';

describe(`sbb-notification`, () => {
  describe('renders', () => {
    let element: SbbNotificationElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-notification>The quick brown fox jumps over the lazy dog.</sbb-notification>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['style'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders with a title', () => {
    let element: SbbNotificationElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-notification title-content="Title"
          >The quick brown fox jumps over the lazy dog.</sbb-notification
        >`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['style'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders with a slotted title', () => {
    let element: SbbNotificationElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-notification
          ><span slot="title">Slotted title</span>
          The quick brown fox jumps over the lazy dog.
        </sbb-notification>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['style'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders without the close button', () => {
    let element: SbbNotificationElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-notification title-content="Title" readonly
          >The quick brown fox jumps over the lazy dog.</sbb-notification
        >`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['style'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders size s', () => {
    let element: SbbNotificationElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-notification title-content="Title" size="s"
          >The quick brown fox jumps over the lazy dog.</sbb-notification
        >`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['style'] });
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(
    html`<sbb-notification title-content="Test title">Lorem ipsum ...</sbb-notification>`,
  );
});
