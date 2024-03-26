import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';
import { fixture } from '../../core/testing/private';
import type { SbbAutocompleteGridOptionElement } from '../autocomplete-grid-option';

import { SbbAutocompleteGridOptgroupElement } from './autocomplete-grid-optgroup';

describe(`sbb-autocomplete-grid-optgroup with ${fixture.name}`, () => {
  let element: SbbAutocompleteGridOptgroupElement;

  beforeEach(async () => {
    element = await fixture(
      html`
        <sbb-autocomplete-grid-optgroup label="Group 1">
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-1" value="1"
              >Option 1</sbb-autocomplete-grid-option
            >
            <sbb-autocomplete-grid-actions>
              <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-actions>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-2" value="2" disabled
              >Option 2</sbb-autocomplete-grid-option
            >
            <sbb-autocomplete-grid-actions>
              <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-actions>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option id="option-3" value="3"
              >Option 3</sbb-autocomplete-grid-option
            >
            <sbb-autocomplete-grid-actions>
              <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-actions>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid-optgroup>
      `,
      { modules: ['../index.ts'] },
    );
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridOptgroupElement);
  });

  it('disabled status is inherited', async () => {
    const optionOne = element.querySelector('sbb-autocomplete-grid-option#option-1');
    const optionTwo = element.querySelector('sbb-autocomplete-grid-option#option-2');
    const optionThree = element.querySelector('sbb-autocomplete-grid-option#option-3');
    element.setAttribute('disabled', '');
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
    const optionOne: SbbAutocompleteGridOptionElement = element.querySelector(
      'sbb-autocomplete-grid-option#option-1',
    )!;
    const optionTwo: SbbAutocompleteGridOptionElement = element.querySelector(
      'sbb-autocomplete-grid-option#option-2',
    )!;
    const optionThree: SbbAutocompleteGridOptionElement = element.querySelector(
      'sbb-autocomplete-grid-option#option-3',
    )!;
    const options = [optionOne, optionTwo, optionThree];

    options.forEach((opt) => expect(opt).not.to.have.attribute('selected'));

    element.setAttribute('disabled', '');
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
