import { assert, expect } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom.js';
import { tabKey } from '../../core/testing/private/keys.js';
import { fixture } from '../../core/testing/private.js';
import { describeIf, EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';
import { SbbFormFieldElement } from '../../form-field.js';
import type { SbbAutocompleteGridButtonElement } from '../autocomplete-grid-button.js';
import { SbbAutocompleteGridOptionElement } from '../autocomplete-grid-option.js';

import { SbbAutocompleteGridElement } from './autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';

describe(`sbb-autocomplete-grid`, () => {
  let formField: SbbFormFieldElement;
  let element: SbbAutocompleteGridElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    formField = await fixture(html`
      <sbb-form-field>
        <input />
        <sbb-autocomplete-grid id="myAutocomplete">
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option value="1" id="option-1"
              >Option 1</sbb-autocomplete-grid-option
            >
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button
                id="button-1"
                icon-name="pen-small"
              ></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option value="2" id="option-2"
              >Option 2</sbb-autocomplete-grid-option
            >
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button
                id="button-2"
                icon-name="pen-small"
              ></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
            <sbb-autocomplete-grid-cell>
              <sbb-autocomplete-grid-button
                id="button-3"
                icon-name="trash-small"
              ></sbb-autocomplete-grid-button>
            </sbb-autocomplete-grid-cell>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid>
      </sbb-form-field>
    `);
    input = formField.querySelector<HTMLInputElement>('input')!;
    element = formField.querySelector<SbbAutocompleteGridElement>('sbb-autocomplete-grid')!;
  });

  describeIf(isSafari, 'Safari', async () => {
    it('renders and sets the correct attributes', () => {
      assert.instanceOf(formField, SbbFormFieldElement);
      assert.instanceOf(element, SbbAutocompleteGridElement);

      expect(element).not.to.have.attribute('autocomplete-origin-borderless');

      expect(input).to.have.attribute('autocomplete', 'off');
      expect(input).to.have.attribute('role', 'combobox');
      expect(input).to.have.attribute('aria-autocomplete', 'list');
      expect(input).to.have.attribute('aria-haspopup', 'grid');
      expect(input).to.have.attribute('aria-controls', 'myAutocomplete');
      expect(input).to.have.attribute('aria-owns', 'myAutocomplete');
      expect(input).to.have.attribute('aria-expanded', 'false');
    });
  });

  describeIf(!isSafari, 'Chrome-Firefox', async () => {
    it('renders and sets the correct attributes', () => {
      assert.instanceOf(formField, SbbFormFieldElement);
      assert.instanceOf(element, SbbAutocompleteGridElement);

      expect(element).not.to.have.attribute('autocomplete-origin-borderless');

      expect(input).to.have.attribute('autocomplete', 'off');
      expect(input).to.have.attribute('role', 'combobox');
      expect(input).to.have.attribute('aria-autocomplete', 'list');
      expect(input).to.have.attribute('aria-haspopup', 'grid');
      expect(input).to.have.attribute('aria-controls', 'sbb-autocomplete-grid-11');
      expect(input).to.have.attribute('aria-owns', 'sbb-autocomplete-grid-11');
      expect(input).to.have.attribute('aria-expanded', 'false');
    });
  });

  it('opens and closes with mouse and keyboard', async () => {
    const willOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willOpen);
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const willCloseEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willClose);
    const didCloseEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didClose);

    input.click();
    await waitForCondition(() => willOpenEventSpy.events.length === 1);
    expect(willOpenEventSpy.count).to.be.equal(1);

    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);
    expect(input).to.have.attribute('aria-expanded', 'true');

    await sendKeys({ press: 'Escape' });
    await waitForCondition(() => willCloseEventSpy.events.length === 1);
    expect(willCloseEventSpy.count).to.be.equal(1);
    await waitForCondition(() => didCloseEventSpy.events.length === 1);
    expect(didCloseEventSpy.count).to.be.equal(1);
    expect(input).to.have.attribute('aria-expanded', 'false');

    await sendKeys({ press: 'ArrowDown' });
    await waitForCondition(() => willOpenEventSpy.events.length === 2);
    expect(willOpenEventSpy.count).to.be.equal(2);
    await waitForCondition(() => didOpenEventSpy.events.length === 2);
    expect(didOpenEventSpy.count).to.be.equal(2);
    expect(input).to.have.attribute('aria-expanded', 'true');

    await sendKeys({ press: tabKey });
    await waitForCondition(() => willCloseEventSpy.events.length === 2);
    expect(willCloseEventSpy.count).to.be.equal(2);
    await waitForCondition(() => didCloseEventSpy.events.length === 2);
    expect(didCloseEventSpy.count).to.be.equal(2);
    expect(input).to.have.attribute('aria-expanded', 'false');

    input.click();
    await waitForCondition(() => willOpenEventSpy.events.length === 3);
    expect(willOpenEventSpy.count).to.be.equal(3);
    await waitForCondition(() => didOpenEventSpy.events.length === 3);
    expect(didOpenEventSpy.count).to.be.equal(3);
    expect(input).to.have.attribute('aria-expanded', 'true');

    // Simulate backdrop click
    sendMouse({ type: 'click', position: [formField.offsetWidth + 25, 25] });

    await waitForCondition(() => willCloseEventSpy.events.length === 3);
    expect(willCloseEventSpy.count).to.be.equal(3);
    await waitForCondition(() => didCloseEventSpy.events.length === 3);
    expect(didCloseEventSpy.count).to.be.equal(3);
    expect(input).to.have.attribute('aria-expanded', 'false');
  });

  it('select by mouse', async () => {
    const willOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willOpen);
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const optionSelectedEventSpy = new EventSpy(
      SbbAutocompleteGridOptionElement.events.optionSelected,
    );

    input.focus();
    await waitForCondition(() => willOpenEventSpy.events.length === 1);
    expect(willOpenEventSpy.count).to.be.equal(1);
    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });
    await waitForLitRender(element);

    expect(optionSelectedEventSpy.count).to.be.equal(1);
    expect(optionSelectedEventSpy.firstEvent!.target).to.have.property('id', 'option-2');
  });

  it('select button and get related option', async () => {
    const willOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willOpen);
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const clickSpy = new EventSpy('click');

    input.focus();
    await waitForCondition(() => willOpenEventSpy.events.length === 1);
    expect(willOpenEventSpy.count).to.be.equal(1);
    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);

    const buttonOne = element.querySelector('#button-1') as SbbAutocompleteGridButtonElement;
    buttonOne.click();
    await waitForLitRender(element);

    await waitForCondition(() => clickSpy.events.length === 1);
    expect(clickSpy.count).to.be.equal(1);
    expect(
      (clickSpy.firstEvent!.target as SbbAutocompleteGridButtonElement).option!.textContent,
    ).to.be.equal('Option 1');
    expect(
      (clickSpy.firstEvent!.target as SbbAutocompleteGridButtonElement).option!.value,
    ).to.be.equal('1');
  });

  it('keyboard navigation', async () => {
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const optOne = element.querySelector('#option-1');
    const buttonOne = element.querySelector('#button-1');
    const optTwo = element.querySelector('#option-2');
    const buttonTwo = element.querySelector('#button-2');
    const buttonThree = element.querySelector('#button-3');
    input.focus();

    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(optTwo).to.have.attribute('active');
    expect(buttonTwo).not.to.have.attribute('data-focus-visible');
    expect(buttonThree).not.to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'option-2');

    await sendKeys({ press: 'ArrowRight' });
    await waitForLitRender(element);
    expect(optTwo).not.to.have.attribute('active');
    expect(buttonTwo).to.have.attribute('data-focus-visible');
    expect(buttonThree).not.to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'button-2');

    await sendKeys({ press: 'ArrowRight' });
    await waitForLitRender(element);
    expect(optTwo).not.to.have.attribute('active');
    expect(buttonTwo).not.to.have.attribute('data-focus-visible');
    expect(buttonThree).to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'button-3');

    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(optOne).to.have.attribute('active');
    expect(buttonOne).not.to.have.attribute('data-focus-visible');
    expect(optTwo).not.to.have.attribute('active');
    expect(buttonTwo).not.to.have.attribute('data-focus-visible');
    expect(buttonThree).not.to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'option-1');
  });

  it('opens and select with keyboard', async () => {
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const didCloseEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didClose);
    const optionSelectedEventSpy = new EventSpy(
      SbbAutocompleteGridOptionElement.events.optionSelected,
    );
    const optOne = element.querySelector('#option-1');
    const optTwo = element.querySelector('#option-2');
    input.focus();

    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(optOne).not.to.have.attribute('active');
    expect(optOne).not.to.have.attribute('selected');
    expect(optTwo).to.have.attribute('active');
    expect(optTwo).not.to.have.attribute('selected');
    expect(input).to.have.attribute('aria-activedescendant', 'option-2');

    await sendKeys({ press: 'Enter' });
    await waitForCondition(() => didCloseEventSpy.events.length === 1);
    expect(didCloseEventSpy.count).to.be.equal(1);

    expect(optTwo).not.to.have.attribute('active');
    expect(optTwo).to.have.attribute('selected');
    expect(optionSelectedEventSpy.count).to.be.equal(1);
    expect(input).to.have.attribute('aria-expanded', 'false');
    expect(input).not.to.have.attribute('aria-activedescendant');
  });

  it('opens and select button with keyboard', async () => {
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const clickSpy = new EventSpy('click');
    const optOne = element.querySelector('#option-1');
    const buttonOne = element.querySelector('#button-1');
    const buttonTwo = element.querySelector('#button-2');
    input.focus();

    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(didOpenEventSpy.count).to.be.equal(1);

    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(optOne).to.have.attribute('active');
    expect(buttonOne).not.to.have.attribute('data-focus-visible');
    await sendKeys({ press: 'ArrowRight' });
    expect(optOne).not.to.have.attribute('active');
    expect(buttonOne).to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'button-1');
    await sendKeys({ press: 'Enter' });
    await waitForCondition(() => clickSpy.events.length === 1);
    expect(clickSpy.count).to.be.equal(1);

    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'ArrowRight' });
    await waitForLitRender(element);
    expect(optOne).not.to.have.attribute('active');
    expect(buttonOne).not.to.have.attribute('data-focus-visible');
    expect(buttonTwo).to.have.attribute('data-focus-visible');
    expect(input).to.have.attribute('aria-activedescendant', 'button-2');
    await sendKeys({ press: 'Enter' });
    await waitForCondition(() => clickSpy.events.length === 2);
    expect(clickSpy.count).to.be.equal(2);
  });

  it('should stay closed when disabled', async () => {
    input.setAttribute('disabled', '');

    input.focus();
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');

    input.click();
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');

    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');
  });

  it('should stay closed when readonly', async () => {
    input.setAttribute('readonly', '');

    input.focus();
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');

    input.click();
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');

    await sendKeys({ press: 'ArrowDown' });
    await waitForLitRender(element);
    expect(input).to.have.attribute('aria-expanded', 'false');
  });

  it('does not open if prevented', async () => {
    const willOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willOpen);

    element.addEventListener(SbbAutocompleteGridElement.events.willOpen, (ev) =>
      ev.preventDefault(),
    );
    element.open();

    await waitForCondition(() => willOpenEventSpy.events.length === 1);
    expect(willOpenEventSpy.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('does not close if prevented', async () => {
    const didOpenEventSpy = new EventSpy(SbbAutocompleteGridElement.events.didOpen);
    const willCloseEventSpy = new EventSpy(SbbAutocompleteGridElement.events.willClose);

    element.open();
    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    await waitForLitRender(element);

    element.addEventListener(SbbAutocompleteGridElement.events.willClose, (ev) =>
      ev.preventDefault(),
    );
    element.close();

    await waitForCondition(() => willCloseEventSpy.events.length === 1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'opened');
  });
});
