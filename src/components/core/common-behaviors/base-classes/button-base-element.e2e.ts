import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html, type TemplateResult } from 'lit';

import { EventSpy, waitForLitRender } from '../../testing';
import { fixture } from '../../testing/private';

import { SbbButtonBaseElement } from './button-base-element';

class GenericButton extends SbbButtonBaseElement {
  public disabled = false;

  protected override renderTemplate(): TemplateResult {
    return html`Button`;
  }
}
customElements.define('generic-button', GenericButton);

describe(`SbbButtonBaseElement with ${fixture.name}`, () => {
  describe('template', () => {
    let element: GenericButton;

    beforeEach(async () => {
      element = await fixture(html`<generic-button></generic-button>`, { modules: [] });
    });

    it('renders', async () => {
      assert.instanceOf(element, GenericButton);
    });

    it('check host attributes and content', () => {
      expect(element.getAttribute('dir')).to.be.equal('ltr');
      expect(element.getAttribute('role')).to.be.equal('button');
      expect(element.getAttribute('tabindex')).to.be.equal('0');
      expect(element.shadowRoot!.firstElementChild!.classList.contains('generic-button')).to.be
        .true;
      expect(element.shadowRoot!.textContent!.trim()).to.be.equal('Button');
    });
  });

  describe('events', () => {
    let element: GenericButton;

    beforeEach(async () => {
      element = await fixture(html` <generic-button></generic-button> `, { modules: [] });
    });

    it('no click dispatch if disabled', async () => {
      element.disabled = true;
      await waitForLitRender(element);
      const clickSpy = new EventSpy('click');
      element.click();
      await waitForLitRender(element);
      expect(clickSpy.count).not.to.be.greaterThan(0);
    });

    it('dispatch click if type button', async () => {
      element.type = 'button';
      await waitForLitRender(element);
      const clickSpy = new EventSpy('click');
      element.click();
      await waitForLitRender(element);
      expect(clickSpy.count).to.be.equal(1);
      expect(await element.getAttribute('data-active')).to.be.equal(null);
    });

    it('space keydown and keyup', async () => {
      element.focus();
      await waitForLitRender(element);
      const clickSpy = new EventSpy('click');
      expect(await element.getAttribute('data-active')).to.be.equal(null);

      await sendKeys({ down: 'Space' });
      await waitForLitRender(element);
      expect(await element.getAttribute('data-active')).to.be.equal('');

      await sendKeys({ up: 'Space' });
      await waitForLitRender(element);
      expect(await element.getAttribute('data-active')).to.be.equal(null);
      await waitForLitRender(element);
      expect(clickSpy.count).to.be.equal(1);
    });

    it('enter keydown', async () => {
      element.focus();
      await waitForLitRender(element);
      const clickSpy = new EventSpy('click');

      await sendKeys({ down: 'Enter' });
      await waitForLitRender(element);
      expect(clickSpy.count).to.be.equal(1);
    });
  });
});
