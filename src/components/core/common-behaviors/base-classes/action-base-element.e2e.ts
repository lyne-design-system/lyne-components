import { assert, expect } from '@open-wc/testing';
import { html, type TemplateResult } from 'lit';

import { fixture } from '../../testing/private';

import { SbbActionBaseElement } from './action-base-element';

class GenericAction extends SbbActionBaseElement {
  protected override renderTemplate(): TemplateResult {
    return html`Action`;
  }
}
customElements.define('generic-action', GenericAction);

describe(`SbbActionBaseElement with ${fixture.name}`, () => {
  describe('template', () => {
    let element: GenericAction;

    beforeEach(async () => {
      element = await fixture(html`<generic-action></generic-action>`, { modules: [] });
    });

    it('renders', async () => {
      assert.instanceOf(element, GenericAction);
    });

    it('check host attributes and content', () => {
      expect(element.getAttribute('dir')).to.be.equal('ltr');
      expect(element.shadowRoot!.firstElementChild!.classList.contains('generic-action')).to.be
        .true;
      expect(element.shadowRoot!.textContent!.trim()).to.be.equal('Action');
    });
  });
});
