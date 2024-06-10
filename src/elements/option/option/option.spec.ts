import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import type { SbbAutocompleteElement } from '../../autocomplete.js';
import { fixture } from '../../core/testing/private.js';
import { waitForLitRender, EventSpy } from '../../core/testing.js';
import type { SbbFormFieldElement } from '../../form-field.js';
import type { SbbOptGroupElement } from '../optgroup.js';

import { SbbOptionElement } from './option.js';

import '../../autocomplete.js';
import '../../form-field.js';
import '../optgroup.js';

describe(`sbb-option`, () => {
  describe('autocomplete', () => {
    let element: SbbFormFieldElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete>
            <sbb-option id="option-1" value="1">Option 1</sbb-option>
            <sbb-option id="option-2" value="2">Option 2</sbb-option>
            <sbb-option id="option-3" value="3">Option 3</sbb-option>
          </sbb-autocomplete>
        </sbb-form-field>
      `);
    });

    it('renders', async () => {
      const option = element.querySelector('sbb-option');
      assert.instanceOf(option, SbbOptionElement);
    });

    it('set selected and emits on click', async () => {
      const selectionChangeSpy = new EventSpy(SbbOptionElement.events.selectionChange);
      const optionOne = element.querySelector<SbbOptionElement>('sbb-option')!;

      optionOne.dispatchEvent(new CustomEvent('click'));
      await waitForLitRender(element);

      expect(optionOne.selected).to.be.equal(true);
      expect(selectionChangeSpy.count).to.be.equal(1);
    });

    it('highlight on input', async () => {
      const input = element.querySelector<HTMLInputElement>('input')!;
      const autocomplete = element.querySelector<SbbAutocompleteElement>('sbb-autocomplete')!;
      const options = element.querySelectorAll('sbb-option');
      const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');
      const optionTwoLabel = options[1].shadowRoot!.querySelector('.sbb-option__label');
      const optionThreeLabel = options[2].shadowRoot!.querySelector('.sbb-option__label');

      input.focus();
      await sendKeys({ press: '1' });
      await waitForLitRender(autocomplete);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight">Option</span>
          <span>1</span>
          <span class="sbb-option__label--highlight"></span>
        </span>
      `);
      expect(optionTwoLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          Option 2
        </span>
      `);
      expect(optionThreeLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          Option 3
        </span>
      `);
    });

    it('highlight after option label changed', async () => {
      const input = element.querySelector<HTMLInputElement>('input')!;
      const autocomplete = element.querySelector<SbbAutocompleteElement>('sbb-autocomplete')!;
      const options = element.querySelectorAll('sbb-option');
      const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

      input.focus();
      await sendKeys({ type: 'Opt' });
      await waitForLitRender(autocomplete);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion 1</span>
        </span>
      `);

      options[0].textContent = 'Other content';
      await waitForLitRender(autocomplete);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          Other content
        </span>
      `);

      options[0].textContent = 'Option';
      await waitForLitRender(autocomplete);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion</span>
        </span>
      `);
    });

    it('highlight later added options', async () => {
      const input = element.querySelector<HTMLInputElement>('input')!;
      const autocomplete = element.querySelector<SbbAutocompleteElement>('sbb-autocomplete')!;
      const options = element.querySelectorAll('sbb-option');
      const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

      input.focus();
      await sendKeys({ type: 'Opt' });
      await waitForLitRender(autocomplete);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion 1</span>
        </span>
      `);

      const newOption = document.createElement('sbb-option');
      newOption.innerText = 'Option 4';
      autocomplete.append(newOption);
      await waitForLitRender(autocomplete);

      const newOptionLabel = newOption.shadowRoot!.querySelector('.sbb-option__label');

      expect(newOptionLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion 4</span>
        </span>
      `);
    });

    it('highlight later added options in sbb-optgroup', async () => {
      element = await fixture(html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete>
            <sbb-optgroup>
              <sbb-option id="option-1" value="1">Option 1</sbb-option>
            </sbb-optgroup>
          </sbb-autocomplete>
        </sbb-form-field>
      `);

      const input = element.querySelector<HTMLInputElement>('input')!;
      const optgroup = element.querySelector<SbbOptGroupElement>('sbb-optgroup')!;
      const options = element.querySelectorAll('sbb-option');
      const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

      input.focus();
      await sendKeys({ type: 'Opt' });
      await waitForLitRender(element);

      expect(optionOneLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion 1</span>
        </span>
      `);

      const newOption = document.createElement('sbb-option');
      newOption.innerText = 'Option 2';
      optgroup.append(newOption);
      await waitForLitRender(element);

      const newOptionLabel = newOption.shadowRoot!.querySelector('.sbb-option__label');

      expect(newOptionLabel).dom.to.be.equal(`
        <span class="sbb-option__label">
          <slot></slot>
          <span class="sbb-option__label--highlight"></span>
          <span>Opt</span>
          <span class="sbb-option__label--highlight">ion 2</span>
        </span>
      `);
    });
  });
});
