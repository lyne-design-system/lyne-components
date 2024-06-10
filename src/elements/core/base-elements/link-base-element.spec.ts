import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html, type TemplateResult } from 'lit';

import { fixture } from '../testing/private.js';
import { EventSpy, waitForLitRender } from '../testing.js';

import { SbbLinkBaseElement } from './link-base-element.js';

class GenericLink extends SbbLinkBaseElement {
  public disabled = false;

  protected override renderTemplate(): TemplateResult {
    return html`<span>Link</span>`;
  }
}
customElements.define('generic-link', GenericLink);

describe(`SbbLinkBaseElement`, () => {
  describe('template', () => {
    let element: GenericLink;

    beforeEach(async () => {
      element = await fixture(html`<generic-link href="#"></generic-link>`);
    });

    it('renders', async () => {
      assert.instanceOf(element, GenericLink);
    });

    it('check host attributes and content', () => {
      expect(element.getAttribute('dir')).to.be.equal('ltr');
      expect(element.shadowRoot!.firstElementChild!.classList.contains('generic-link')).to.be.true;
      expect(element.shadowRoot!.textContent!.trim()).to.be.equal('Link');
    });
  });

  describe('events', () => {
    let element: GenericLink;

    beforeEach(async () => {
      element = await fixture(html`<generic-link href="#"></generic-link>`);
    });

    it('no click dispatch if disabled', async () => {
      element.disabled = true;
      await waitForLitRender(element);
      const clickSpy = new EventSpy('click');
      element.click();
      await waitForLitRender(element);
      expect(clickSpy.count).not.to.be.greaterThan(0);
    });

    it('dispatch event', async () => {
      const clickSpy = new EventSpy('click');
      element.click();
      await waitForLitRender(element);
      expect(clickSpy.count).to.be.greaterThan(0);
    });

    it('enter keydown', async () => {
      const clickSpy = new EventSpy('click');
      element.focus();

      await sendKeys({ down: 'Enter' });
      await waitForLitRender(element);
      expect(clickSpy.count).to.be.equal(1);
    });
  });
});

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'generic-link': GenericLink;
  }
}
