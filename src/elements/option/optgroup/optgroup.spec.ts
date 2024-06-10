import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { waitForLitRender } from '../../core/testing.js';
import type { SbbOptionElement } from '../option.js';
import '../option.js';

import { SbbOptGroupElement } from './optgroup.js';

describe(`sbb-optgroup`, () => {
  let element: SbbOptGroupElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-optgroup label="Group 1">
        <sbb-option id="option-1" value="option-1">Label 1</sbb-option>
        <sbb-option id="option-2" disabled value="option-2">Label 2</sbb-option>
        <sbb-option id="option-3" value="option-3">Label 3</sbb-option>
      </sbb-optgroup>
    `);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbOptGroupElement);
  });

  it('disabled status is inherited', async () => {
    const optionOne = element.querySelector(':scope > sbb-option#option-1');
    const optionTwo = element.querySelector(':scope > sbb-option#option-2');
    const optionThree = element.querySelector(':scope > sbb-option#option-3');
    element.toggleAttribute('disabled', true);
    await waitForLitRender(element);

    expect(element).to.have.attribute('disabled');
    expect(optionOne).to.have.attribute('data-group-disabled');
    expect(optionTwo).to.have.attribute('data-group-disabled');
    expect(optionTwo).to.have.attribute('disabled');
    expect(optionThree).to.have.attribute('data-group-disabled');

    element.removeAttribute('disabled');
    await waitForLitRender(element);
    expect(optionTwo).not.to.have.attribute('data-group-disabled');
    expect(optionTwo).to.have.attribute('disabled');
  });

  it('disabled status prevents changes', async () => {
    const optionOne = element.querySelector<SbbOptionElement>(':scope > sbb-option#option-1')!;
    const optionTwo = element.querySelector<SbbOptionElement>(':scope > sbb-option#option-2')!;
    const optionThree = element.querySelector<SbbOptionElement>(':scope > sbb-option#option-3')!;
    const options = [optionOne, optionTwo, optionThree];

    options.forEach((opt) => expect(opt).not.to.have.attribute('selected'));

    element.toggleAttribute('disabled', true);
    await waitForLitRender(element);
    expect(element).to.have.attribute('disabled');

    // clicks should have no effect since the group is disabled
    for (const opt of options) {
      opt.click();
      await waitForLitRender(opt);
      expect(opt).not.to.have.attribute('selected');
    }

    element.removeAttribute('disabled');
    await waitForLitRender(element);
    for (const opt of options) {
      opt.click();
      await waitForLitRender(opt);
    }

    expect(optionOne).to.have.attribute('selected');
    expect(optionTwo).not.to.have.attribute('selected');
    expect(optionThree).to.have.attribute('selected');
  });
});
