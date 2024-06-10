import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { waitForLitRender } from '../../core/testing.js';
import { SbbFormFieldElement } from '../form-field.js';

import { SbbFormFieldClearElement } from './form-field-clear.js';

describe(`sbb-form-field-clear`, () => {
  let element: SbbFormFieldClearElement;
  let formField: SbbFormFieldElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    formField = await fixture(
      html` <sbb-form-field>
        <label>Label</label>
        <input id="input" type="text" placeholder="Input placeholder" value="Input value" />
        <sbb-form-field-clear></sbb-form-field-clear>
      </sbb-form-field>`,
    );
    element = formField.querySelector<SbbFormFieldClearElement>('sbb-form-field-clear')!;
    input = formField.querySelector<HTMLInputElement>('input')!;
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbFormFieldClearElement);
    assert.instanceOf(formField, SbbFormFieldElement);
  });

  it('clears the value and sets the focus on the input', async () => {
    expect(input.value).to.be.equal('Input value');

    await element.click();
    await waitForLitRender(element);

    expect(input.value).not.to.be.ok; // to be falsy
    expect(document.activeElement!.id).to.be.equal('input');
    expect(element).to.have.style('display', 'none');
  });

  it('is hidden if the form field is disabled', async () => {
    input.toggleAttribute('disabled', true);

    await waitForLitRender(element);

    expect(element).to.have.style('display', 'none');
  });

  it('is hidden if the form field is readonly', async () => {
    input.toggleAttribute('readonly', true);

    await waitForLitRender(element);

    expect(element).to.have.style('display', 'none');
  });
});
