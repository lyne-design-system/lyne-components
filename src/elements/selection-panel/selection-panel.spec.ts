import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';

import type { SbbCheckboxGroupElement } from '../checkbox.js';
import { SbbCheckboxElement } from '../checkbox.js';
import { fixture } from '../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../core/testing.js';
import type { SbbRadioButtonGroupElement } from '../radio-button.js';
import { SbbRadioButtonElement } from '../radio-button.js';

import { SbbSelectionPanelElement } from './selection-panel.js';
import '../link/block-link-button.js';

describe(`sbb-selection-panel`, () => {
  let elements: SbbSelectionPanelElement[];

  const getPageContent = (inputType: string): TemplateResult => {
    const tagGroupElement = unsafeStatic(`sbb-${inputType}-group`);
    const tagSingle = unsafeStatic(`sbb-${inputType}`);
    /* eslint-disable lit/binding-positions */
    return html`
      <${tagGroupElement} ${inputType === 'radio-button' && 'value="Value one"'}>
        <sbb-selection-panel id="sbb-selection-panel-1">
          <${tagSingle} id="sbb-input-1" value="Value one" ?checked='${
            inputType === 'checkbox'
          }'>Value one</${tagSingle}>
          <div id="panel-content-1" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-panel>
        <sbb-selection-panel id="sbb-selection-panel-2">
          <${tagSingle} id="sbb-input-2" value="Value two">Value two</${tagSingle}>
          <div id="panel-content-2" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-panel>
        <sbb-selection-panel id="sbb-selection-panel-3">
          <${tagSingle} id="sbb-input-3" value="Value three" disabled>Value three</${tagSingle}>
          <div id="panel-content-3" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-panel>
        <sbb-selection-panel id="sbb-selection-panel-4">
          <${tagSingle} id="sbb-input-4" value="Value four">Value four</${tagSingle}>
          <div id="panel-content-4" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-panel>
      </${tagGroupElement}>`;
    /* eslint-enable lit/binding-positions */
  };

  const forceOpenTest = async (
    wrapper: SbbRadioButtonGroupElement | SbbCheckboxGroupElement,
    secondInput: SbbRadioButtonElement | SbbCheckboxElement,
  ): Promise<void> => {
    elements.forEach((e) => (e.forceOpen = true));
    await waitForLitRender(wrapper);

    for (const el of elements) {
      await waitForCondition(() => el.getAttribute('data-state') === 'opened');
      expect(el).to.have.attribute('data-state', 'opened');
    }

    expect(secondInput.checked).to.be.false;
    secondInput.click();
    await waitForLitRender(wrapper);
    expect(secondInput.checked).to.be.true;
  };

  const preservesDisabled = async (
    wrapper: SbbRadioButtonGroupElement | SbbCheckboxGroupElement,
    disabledInput: SbbRadioButtonElement | SbbCheckboxElement,
    secondInput: SbbRadioButtonElement | SbbCheckboxElement,
  ): Promise<void> => {
    wrapper.disabled = true;
    await waitForLitRender(wrapper);

    disabledInput.click();
    await waitForLitRender(wrapper);
    expect(disabledInput.checked).to.be.false;

    secondInput.click();
    await waitForLitRender(wrapper);
    expect(secondInput.checked).to.be.false;

    wrapper.disabled = false;
    await waitForLitRender(wrapper);

    disabledInput.click();
    await waitForLitRender(wrapper);
    expect(disabledInput.checked).to.be.false;

    secondInput.click();
    await waitForLitRender(wrapper);
    expect(secondInput.checked).to.be.true;
  };

  const wrapsAround = async (
    wrapper: SbbRadioButtonGroupElement | SbbCheckboxGroupElement,
    firstInput: SbbRadioButtonElement | SbbCheckboxElement,
    secondInput: SbbRadioButtonElement | SbbCheckboxElement,
  ): Promise<void> => {
    secondInput.click();
    secondInput.focus();
    await waitForLitRender(wrapper);

    expect(secondInput.checked).to.be.true;
    await sendKeys({ down: 'ArrowRight' });
    await sendKeys({ down: 'ArrowRight' });
    await waitForLitRender(wrapper);

    expect(document.activeElement!.id).to.be.equal(firstInput.id);
  };

  describe('with radio buttons', () => {
    let wrapper: SbbRadioButtonGroupElement;
    let firstPanel: SbbSelectionPanelElement;
    let firstInput: SbbRadioButtonElement;
    let secondPanel: SbbSelectionPanelElement;
    let secondInput: SbbRadioButtonElement;
    let disabledInput: SbbRadioButtonElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.didOpen);

      wrapper = await fixture(getPageContent('radio-button'));
      elements = Array.from(wrapper.querySelectorAll('sbb-selection-panel'));
      firstPanel = wrapper.querySelector<SbbSelectionPanelElement>('#sbb-selection-panel-1')!;
      firstInput = wrapper.querySelector<SbbRadioButtonElement>('#sbb-input-1')!;
      secondPanel = wrapper.querySelector<SbbSelectionPanelElement>('#sbb-selection-panel-2')!;
      secondInput = wrapper.querySelector<SbbRadioButtonElement>('#sbb-input-2')!;
      disabledInput = wrapper.querySelector<SbbRadioButtonElement>('#sbb-input-3')!;
    });

    it('renders', () => {
      elements.forEach((e) => assert.instanceOf(e, SbbSelectionPanelElement));
      assert.instanceOf(firstPanel, SbbSelectionPanelElement);
      assert.instanceOf(firstInput, SbbRadioButtonElement);
      assert.instanceOf(secondPanel, SbbSelectionPanelElement);
      assert.instanceOf(secondInput, SbbRadioButtonElement);
    });

    it('selects input on click and shows related content', async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.didOpen);

      await waitForLitRender(wrapper);

      expect(firstInput.checked).to.be.false;
      expect(firstPanel).to.have.attribute('data-state', 'closed');

      expect(secondInput.checked).to.be.false;
      expect(secondPanel).to.have.attribute('data-state', 'closed');

      secondInput.click();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      await waitForLitRender(wrapper);

      expect(willOpenEventSpy.count).to.be.equal(1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(firstInput.checked).to.be.false;
      expect(firstPanel).to.have.attribute('data-state', 'closed');
      expect(secondInput.checked).to.be.true;
      expect(secondPanel).to.have.attribute('data-state', 'opened');
    });

    it('always displays related content with forceOpen', async () => {
      await forceOpenTest(wrapper, secondInput);
    });

    it('dispatches event on input change', async () => {
      const changeSpy = new EventSpy('change');
      const inputSpy = new EventSpy('input');

      secondInput.click();
      await waitForLitRender(wrapper);
      expect(secondInput.checked).to.be.true;
      expect(firstInput.checked).to.be.false;
      expect(changeSpy.count).to.be.equal(1);
      expect(inputSpy.count).to.be.equal(1);

      firstInput.click();
      await waitForLitRender(wrapper);
      expect(secondInput.checked).to.be.false;
      expect(firstInput.checked).to.be.true;
      expect(changeSpy.count).to.be.equal(2);
      expect(inputSpy.count).to.be.equal(2);
    });

    it('does not select disabled input on click', async () => {
      firstInput.click();
      await waitForLitRender(wrapper);
      expect(firstInput.checked).to.be.true;
      expect(disabledInput.checked).to.be.false;

      disabledInput.click();
      await waitForLitRender(wrapper);
      expect(disabledInput.checked).to.be.false;
      expect(firstInput.checked).to.be.true;
    });

    it('preserves input button disabled state after being disabled from group', async () => {
      await preservesDisabled(wrapper, disabledInput, secondInput);
    });

    it('focuses input on left arrow key pressed and selects it on space key pressed', async () => {
      const fourthInput = wrapper.querySelector<SbbRadioButtonElement>('#sbb-input-4')!;

      firstInput.click();
      firstInput.focus();
      await sendKeys({ down: 'ArrowLeft' });
      await waitForLitRender(wrapper);
      expect(document.activeElement!.id).to.be.equal(fourthInput.id);
      expect(firstInput.checked).to.be.true;
      expect(fourthInput.checked).to.be.false;

      await sendKeys({ press: ' ' });
      expect(fourthInput.checked).to.be.true;
      expect(firstInput.checked).to.be.false;
    });

    it('focuses input on right arrow key pressed and selects it on space key pressed', async () => {
      firstInput.click();
      firstInput.focus();
      await sendKeys({ down: 'ArrowRight' });
      await waitForLitRender(wrapper);
      expect(document.activeElement!.id).to.be.equal(secondInput.id);
      expect(firstInput.checked).to.be.true;
      expect(secondInput.checked).to.be.false;

      await sendKeys({ press: ' ' });
      expect(secondInput.checked).to.be.true;
      expect(firstInput.checked).to.be.false;
    });

    it('wraps around on arrow key navigation', async () => {
      await wrapsAround(wrapper, firstInput, secondInput);
    });
  });

  describe('with radio group with no slotted content', () => {
    it('focus selected, the focus and select on keyboard navigation', async () => {
      const wrapperNoContent = await fixture(html`
        <sbb-radio-button-group id="group-no-content" value="Value 2">
          <sbb-selection-panel id="no-content-1">
            <sbb-radio-button id="input-no-content-1" value="Value 1">Value one</sbb-radio-button>
          </sbb-selection-panel>
          <sbb-selection-panel id="no-content-2">
            <sbb-radio-button id="input-no-content-2" value="Value 2">Value two</sbb-radio-button>
          </sbb-selection-panel>
          <sbb-selection-panel id="no-content-3">
            <sbb-radio-button id="input-no-content-3" value="Value 3" disabled
              >Value three</sbb-radio-button
            >
          </sbb-selection-panel>
          <sbb-selection-panel id="no-content-4">
            <sbb-radio-button id="input-no-content-4" value="Value 4">Value four</sbb-radio-button>
          </sbb-selection-panel>
        </sbb-radio-button-group>
      `);
      const firstInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-1')!;
      const secondInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-2')!;
      const fourthInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-4')!;
      const firstPanel = wrapperNoContent.querySelector<SbbSelectionPanelElement>('#no-content-1')!;
      const secondPanel =
        wrapperNoContent.querySelector<SbbSelectionPanelElement>('#no-content-2')!;

      expect(firstPanel).to.have.attribute('data-state', 'closed');
      expect(secondPanel).to.have.attribute('data-state', 'closed');

      await sendKeys({ down: 'Tab' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);

      await sendKeys({ down: 'ArrowUp' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(firstInputNoContent.id);
      expect(secondInputNoContent.checked).to.be.false;
      expect(firstInputNoContent.checked).to.be.true;

      await sendKeys({ down: 'ArrowRight' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);
      expect(firstInputNoContent.checked).to.be.false;
      expect(secondInputNoContent.checked).to.be.true;

      await sendKeys({ down: 'ArrowDown' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(fourthInputNoContent.id);
      expect(secondInputNoContent.checked).to.be.false;
      expect(fourthInputNoContent.checked).to.be.true;

      await sendKeys({ down: 'ArrowLeft' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);
      expect(fourthInputNoContent.checked).to.be.false;
      expect(secondInputNoContent.checked).to.be.true;
    });
  });

  describe('with nested radio buttons', () => {
    let nestedElement: SbbRadioButtonGroupElement;
    let panel1: SbbSelectionPanelElement;
    let panel2: SbbSelectionPanelElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;
    let willCloseEventSpy: EventSpy<Event>;
    let didCloseEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.didOpen);
      willCloseEventSpy = new EventSpy(SbbSelectionPanelElement.events.willClose);
      didCloseEventSpy = new EventSpy(SbbSelectionPanelElement.events.didClose);

      nestedElement = await fixture(html`
        <sbb-radio-button-group orientation="vertical" horizontal-from="large">
          <sbb-selection-panel id="panel1">
            <sbb-radio-button value="main1" checked> Main Option 1 </sbb-radio-button>
            <sbb-radio-button-group orientation="vertical" slot="content">
              <sbb-radio-button value="sub1" checked>Suboption 1</sbb-radio-button>
              <sbb-radio-button value="sub2">Suboption 2</sbb-radio-button>
            </sbb-radio-button-group>
          </sbb-selection-panel>

          <sbb-selection-panel id="panel2">
            <sbb-radio-button value="main2"> Main Option 2 </sbb-radio-button>
            <sbb-radio-button-group orientation="vertical" slot="content">
              <sbb-radio-button value="sub3">Suboption 3</sbb-radio-button>
              <sbb-radio-button value="sub4">Suboption 4</sbb-radio-button>
            </sbb-radio-button-group>
          </sbb-selection-panel>
        </sbb-radio-button-group>
      `);
      panel1 = nestedElement.querySelector<SbbSelectionPanelElement>('#panel1')!;
      panel2 = nestedElement.querySelector<SbbSelectionPanelElement>('#panel2')!;
    });

    it('should display expanded label correctly', async () => {
      const mainRadioButton1 = nestedElement.querySelector<SbbRadioButtonElement>(
        "sbb-radio-button[value='main1']",
      )!;
      const mainRadioButton1Label = mainRadioButton1.shadowRoot!.querySelector(
        '.sbb-screen-reader-only:not(input)',
      )!;
      const mainRadioButton2 = nestedElement.querySelector<SbbRadioButtonElement>(
        "sbb-radio-button[value='main2']",
      )!;
      const mainRadioButton2Label = mainRadioButton2.shadowRoot!.querySelector(
        '.sbb-screen-reader-only:not(input)',
      )!;
      const subRadioButton1 = nestedElement
        .querySelector("sbb-radio-button[value='sub1']")!
        .shadowRoot!.querySelector('.sbb-screen-reader-only:not(input)');

      await waitForCondition(() => didOpenEventSpy.count === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(mainRadioButton1Label.textContent!.trim()).to.be.equal(', expanded');
      expect(mainRadioButton2Label.textContent!.trim()).to.be.equal(', collapsed');
      expect(subRadioButton1).to.be.null;
      expect(panel1).to.have.attribute('data-state', 'opened');
      expect(panel2).to.have.attribute('data-state', 'closed');

      // Activate main option 2
      mainRadioButton2.click();

      await waitForCondition(() => didOpenEventSpy.count === 2);
      await waitForCondition(() => didCloseEventSpy.count === 1);

      expect(willOpenEventSpy.count).to.be.equal(2);
      expect(didOpenEventSpy.count).to.be.equal(2);
      expect(willCloseEventSpy.count).to.be.equal(1);
      expect(didCloseEventSpy.count).to.be.equal(1);
      expect(mainRadioButton1Label.textContent!.trim()).to.be.equal(', collapsed');
      expect(mainRadioButton2Label.textContent!.trim()).to.be.equal(', expanded');
      expect(subRadioButton1).to.be.null;
      expect(panel1).to.have.attribute('data-state', 'closed');
      expect(panel2).to.have.attribute('data-state', 'opened');
    });

    it('should mark only outer group children as disabled', async () => {
      nestedElement.toggleAttribute('disabled', true);
      await waitForLitRender(nestedElement);

      const radioButtons = Array.from(nestedElement.querySelectorAll('sbb-radio-button'));

      expect(radioButtons.length).to.be.equal(6);
      expect(radioButtons[0]).to.have.attribute('disabled');
      expect(radioButtons[1]).not.to.have.attribute('disabled');
      expect(radioButtons[2]).not.to.have.attribute('disabled');
      expect(radioButtons[3]).to.have.attribute('disabled');
      expect(radioButtons[4]).not.to.have.attribute('disabled');
      expect(radioButtons[5]).not.to.have.attribute('disabled');
    });

    it('should not with interfere content on selection', async () => {
      const main1 = nestedElement.querySelector<SbbRadioButtonElement>(
        'sbb-radio-button[value="main1"]',
      )!;
      const main2 = nestedElement.querySelector<SbbRadioButtonElement>(
        'sbb-radio-button[value="main2"]',
      )!;
      const sub1 = nestedElement.querySelector<SbbRadioButtonElement>(
        'sbb-radio-button[value="sub1"]',
      )!;

      await waitForCondition(() => didOpenEventSpy.count === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(panel1).to.have.attribute('data-state', 'opened');
      expect(panel2).to.have.attribute('data-state', 'closed');
      expect(main1.checked).to.be.true;
      expect(main2.checked).to.be.false;
      expect(sub1.checked).to.be.true;

      main2.checked = true;

      await waitForCondition(() => didOpenEventSpy.count === 2);
      await waitForCondition(() => didCloseEventSpy.count === 1);

      expect(willOpenEventSpy.count).to.be.equal(2);
      expect(didOpenEventSpy.count).to.be.equal(2);
      expect(willCloseEventSpy.count).to.be.equal(1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(panel1).to.have.attribute('data-state', 'closed');
      expect(panel2).to.have.attribute('data-state', 'opened');
      expect(main1.checked).to.be.false;
      expect(main2.checked).to.be.true;
      expect(sub1.checked).to.be.true;
    });
  });

  describe('with template tag manipulation', () => {
    it('should initialize the group correctly after append', async () => {
      const root = await fixture(html`
        <div>
          <template>
            <sbb-selection-panel>
              <sbb-radio-button value="main1" checked="true"> Main Option 1 </sbb-radio-button>
              <sbb-radio-button-group orientation="vertical" slot="content">
                <sbb-radio-button value="sub1" checked>Suboption 1</sbb-radio-button>
                <sbb-radio-button value="sub2">Suboption 2</sbb-radio-button>
              </sbb-radio-button-group>
            </sbb-selection-panel>

            <sbb-selection-panel>
              <sbb-radio-button value="main2"> Main Option 2 </sbb-radio-button>
              <sbb-radio-button-group orientation="vertical" slot="content">
                <sbb-radio-button value="sub3">Suboption 3</sbb-radio-button>
                <sbb-radio-button value="sub4">Suboption 4</sbb-radio-button>
              </sbb-radio-button-group>
            </sbb-selection-panel>
          </template>

          <sbb-radio-button-group value="main1"></sbb-radio-button-group>
        </div>
      `);

      const radioGroup = root.querySelector<SbbRadioButtonGroupElement>('sbb-radio-button-group')!;
      const selectionPanels = Array.from(
        root.querySelector('template')!.content.querySelectorAll('sbb-selection-panel'),
      );

      selectionPanels.forEach((el) => radioGroup.appendChild(el));
      await waitForLitRender(radioGroup);

      const sub1 = root.querySelector<SbbRadioButtonElement>("sbb-radio-button[value='sub1']")!;
      const sub2 = root.querySelector<SbbRadioButtonElement>("sbb-radio-button[value='sub2']")!;

      expect(sub1.checked).to.be.true;
      expect(sub2.checked).to.be.false;

      sub2.click();
      await waitForLitRender(radioGroup);

      expect(sub1.checked).to.be.false;
      expect(sub2.checked).to.be.true;
    });
  });

  describe('with checkboxes', () => {
    let wrapper: SbbCheckboxGroupElement;
    let firstPanel: SbbSelectionPanelElement;
    let firstInput: SbbCheckboxElement;
    let secondPanel: SbbSelectionPanelElement;
    let secondInput: SbbCheckboxElement;
    let disabledInput: SbbCheckboxElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;
    let willCloseEventSpy: EventSpy<Event>;
    let didCloseEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionPanelElement.events.didOpen);
      willCloseEventSpy = new EventSpy(SbbSelectionPanelElement.events.willClose);
      didCloseEventSpy = new EventSpy(SbbSelectionPanelElement.events.didClose);

      wrapper = await fixture(getPageContent('checkbox'));
      elements = Array.from(wrapper.querySelectorAll('sbb-selection-panel'));
      firstPanel = wrapper.querySelector<SbbSelectionPanelElement>('#sbb-selection-panel-1')!;
      firstInput = wrapper.querySelector<SbbCheckboxElement>('#sbb-input-1')!;
      secondPanel = wrapper.querySelector<SbbSelectionPanelElement>('#sbb-selection-panel-2')!;
      secondInput = wrapper.querySelector<SbbCheckboxElement>('#sbb-input-2')!;
      disabledInput = wrapper.querySelector<SbbCheckboxElement>('#sbb-input-3')!;
    });

    it('renders', () => {
      elements.forEach((e) => assert.instanceOf(e, SbbSelectionPanelElement));

      assert.instanceOf(firstPanel, SbbSelectionPanelElement);
      assert.instanceOf(firstInput, SbbCheckboxElement);
      assert.instanceOf(secondPanel, SbbSelectionPanelElement);
      assert.instanceOf(secondInput, SbbCheckboxElement);
    });

    it('selects input on click and shows related content', async () => {
      await waitForLitRender(wrapper);
      await waitForCondition(() => didOpenEventSpy.events.length === 1);

      expect(willOpenEventSpy.count).to.be.equal(1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(firstPanel).to.have.attribute('data-state', 'opened');
      expect(firstInput.checked).to.be.true;
      expect(secondPanel).to.have.attribute('data-state', 'closed');
      expect(secondInput.checked).to.be.false;

      secondInput.click();
      await waitForLitRender(wrapper);
      await waitForCondition(() => didOpenEventSpy.events.length === 2);

      expect(willOpenEventSpy.count).to.be.equal(2);
      expect(didOpenEventSpy.count).to.be.equal(2);
      expect(firstInput.checked).to.be.true;
      expect(firstPanel).to.have.attribute('data-state', 'opened');
      expect(secondInput.checked).to.be.true;
      expect(secondPanel).to.have.attribute('data-state', 'opened');
    });

    it('deselects input on click and hides related content', async () => {
      await waitForCondition(() => firstPanel.getAttribute('data-state') === 'opened');
      expect(firstInput.checked).to.be.true;
      expect(firstPanel).to.have.attribute('data-state', 'opened');

      firstInput.click();

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(willCloseEventSpy.count).to.be.equal(1);
      expect(didCloseEventSpy.count).to.be.equal(1);
      expect(firstInput.checked).to.be.false;
      expect(firstPanel).to.have.attribute('data-state', 'closed');
    });

    it('always displays related content with forceOpen', async () => {
      await forceOpenTest(wrapper, secondInput);
    });

    it('dispatches event on input change', async () => {
      const changeSpy = new EventSpy('change');
      const inputSpy = new EventSpy('input');

      secondInput.click();
      await waitForLitRender(wrapper);
      expect(secondInput.checked).to.be.true;
      expect(firstInput.checked).to.be.true;
      expect(changeSpy.count).to.be.equal(1);
      expect(inputSpy.count).to.be.equal(1);

      firstInput.click();
      await waitForLitRender(wrapper);
      expect(firstInput.checked).to.be.false;
      expect(secondInput.checked).to.be.true;
      expect(changeSpy.count).to.be.equal(2);
      expect(inputSpy.count).to.be.equal(2);
    });

    it('does not select disabled input on click', async () => {
      disabledInput.click();
      await waitForLitRender(wrapper);
      expect(disabledInput.checked).to.be.false;
      expect(firstInput.checked).to.be.true;
    });

    it('preserves input button disabled state after being disabled from group', async () => {
      await preservesDisabled(wrapper, disabledInput, secondInput);
    });

    it('focuses input on left arrow key pressed and selects it on space key pressed', async () => {
      const fourthInput = wrapper.querySelector<SbbRadioButtonElement>('#sbb-input-4')!;

      firstInput.click();
      firstInput.focus();
      await sendKeys({ down: 'ArrowLeft' });
      await waitForLitRender(wrapper);
      expect(document.activeElement!.id).to.be.equal(fourthInput.id);
      expect(firstInput.checked).to.be.false;
      expect(fourthInput.checked).to.be.false;

      await sendKeys({ press: ' ' });

      await waitForCondition(() => fourthInput.checked);
      expect(fourthInput.checked).to.be.true;
      expect(firstInput.checked).to.be.false;
    });

    it('focuses input on right arrow key pressed and selects it on space key pressed', async () => {
      firstInput.click();
      firstInput.focus();
      await sendKeys({ down: 'ArrowRight' });
      await waitForLitRender(wrapper);
      expect(document.activeElement!.id).to.be.equal(secondInput.id);
      expect(firstInput.checked).to.be.false;
      expect(secondInput.checked).to.be.false;

      await sendKeys({ press: ' ' });

      await waitForCondition(() => !firstInput.checked);
      expect(firstInput.checked).to.be.false;
      expect(secondInput.checked).to.be.true;
    });

    it('wraps around on arrow key navigation', async () => {
      await wrapsAround(wrapper, firstInput, secondInput);
    });
  });

  describe('with nested checkboxes', () => {
    let nestedElement: SbbCheckboxGroupElement;

    beforeEach(async () => {
      nestedElement = await fixture(html`
        <sbb-checkbox-group orientation="vertical" horizontal-from="large">
          <sbb-selection-panel>
            <sbb-checkbox value="main1" checked> Main Option 1 </sbb-checkbox>
            <sbb-checkbox-group orientation="vertical" slot="content">
              <sbb-checkbox value="sub1" checked>Suboption 1</sbb-checkbox>
              <sbb-checkbox value="sub2">Suboption 2</sbb-checkbox>
            </sbb-checkbox-group>
          </sbb-selection-panel>

          <sbb-selection-panel>
            <sbb-checkbox value="main2"> Main Option 2 </sbb-checkbox>
            <sbb-checkbox-group orientation="vertical" slot="content">
              <sbb-checkbox value="sub3">Suboption 3</sbb-checkbox>
              <sbb-checkbox value="sub4">Suboption 4</sbb-checkbox>
            </sbb-checkbox-group>
          </sbb-selection-panel>
        </sbb-checkbox-group>
      `);
    });

    it('should display expanded label correctly', async () => {
      const mainCheckbox1: SbbCheckboxElement = nestedElement.querySelector<SbbCheckboxElement>(
        "sbb-checkbox[value='main1']",
      )!;
      const mainCheckbox1Label = mainCheckbox1.shadowRoot!.querySelector(
        '.sbb-checkbox__expanded-label',
      )!;
      const mainCheckbox2: SbbCheckboxElement = nestedElement.querySelector<SbbCheckboxElement>(
        "sbb-checkbox[value='main2']",
      )!;
      const mainCheckbox2Label = mainCheckbox2.shadowRoot!.querySelector(
        '.sbb-checkbox__expanded-label',
      )!;
      const subCheckbox1 = document
        .querySelector("sbb-checkbox[value='sub1']")!
        .shadowRoot!.querySelector('.sbb-checkbox__expanded-label');

      expect(mainCheckbox1Label.textContent!.trim()).to.be.equal(', expanded');
      expect(mainCheckbox2Label.textContent!.trim()).to.be.equal(', collapsed');
      expect(subCheckbox1).to.be.empty;

      // Deactivate main option 1
      mainCheckbox1.click();

      // Activate main option 2
      mainCheckbox2.click();

      await waitForLitRender(nestedElement);

      expect(mainCheckbox1Label.textContent!.trim()).to.be.equal(', collapsed');
      expect(mainCheckbox2Label.textContent!.trim()).to.be.equal(', expanded');
      expect(subCheckbox1).to.be.empty;
    });

    it('should mark only outer group children as disabled', async () => {
      nestedElement.toggleAttribute('disabled', true);
      await waitForLitRender(nestedElement);

      const checkboxes = Array.from(nestedElement.querySelectorAll('sbb-checkbox'));

      expect(checkboxes.length).to.be.equal(6);
      expect(checkboxes[0]).to.have.attribute('disabled');
      expect(checkboxes[1]).not.to.have.attribute('disabled');
      expect(checkboxes[2]).not.to.have.attribute('disabled');
      expect(checkboxes[3]).to.have.attribute('disabled');
      expect(checkboxes[4]).not.to.have.attribute('disabled');
      expect(checkboxes[5]).not.to.have.attribute('disabled');
    });
  });
});
