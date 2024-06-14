import { assert, expect } from '@open-wc/testing';
import { a11ySnapshot, sendKeys } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';

import {
  SbbCheckboxPanelElement,
  type SbbCheckboxElement,
  type SbbCheckboxGroupElement,
} from '../checkbox.js';
import { tabKey } from '../core/testing/private/keys.js';
import { fixture } from '../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../core/testing.js';
import {
  SbbRadioButtonPanelElement,
  type SbbRadioButtonElement,
  type SbbRadioButtonGroupElement,
} from '../radio-button.js';

import { SbbSelectionExpansionPanelElement } from './selection-expansion-panel.js';

import '../link/block-link-button.js';
import '../selection-expansion-panel.js';

describe(`sbb-selection-expansion-panel`, () => {
  let elements: SbbSelectionExpansionPanelElement[];

  const getPageContent = (inputType: string): TemplateResult => {
    const tagGroupElement = unsafeStatic(`sbb-${inputType}-group`);
    const tagSingle = unsafeStatic(`sbb-${inputType}-panel`);
    /* eslint-disable lit/binding-positions */
    return html`
      <${tagGroupElement} ${inputType === 'radio-button' && 'value="Value one"'}>
        <sbb-selection-expansion-panel id="sbb-selection-expansion-panel-1">
          <${tagSingle} id="sbb-input-1" value="Value one" ?checked='${
            inputType === 'checkbox'
          }'>Value one</${tagSingle}>
          <div id="panel-content-1" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-expansion-panel>
        <sbb-selection-expansion-panel id="sbb-selection-expansion-panel-2">
          <${tagSingle} id="sbb-input-2" value="Value two">Value two</${tagSingle}>
          <div id="panel-content-2" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-expansion-panel>
        <sbb-selection-expansion-panel id="sbb-selection-expansion-panel-3">
          <${tagSingle} id="sbb-input-3" value="Value three" disabled>Value three</${tagSingle}>
          <div id="panel-content-3" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-expansion-panel>
        <sbb-selection-expansion-panel id="sbb-selection-expansion-panel-4">
          <${tagSingle} id="sbb-input-4" value="Value four">Value four</${tagSingle}>
          <div id="panel-content-4" slot="content">
            Inner Content
            <sbb-block-link-button>Link</sbb-block-link-button>
          </div>
        </sbb-selection-expansion-panel>
      </${tagGroupElement}>`;
    /* eslint-enable lit/binding-positions */
  };

  const forceOpenTest = async (
    wrapper: SbbRadioButtonGroupElement | SbbCheckboxGroupElement,
    secondInput: SbbRadioButtonPanelElement | SbbCheckboxPanelElement,
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
    disabledInput: SbbRadioButtonPanelElement | SbbCheckboxPanelElement,
    secondInput: SbbRadioButtonPanelElement | SbbCheckboxPanelElement,
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
    firstInput: SbbRadioButtonPanelElement | SbbCheckboxPanelElement,
    secondInput: SbbRadioButtonPanelElement | SbbCheckboxPanelElement,
  ): Promise<void> => {
    secondInput.click();
    secondInput.focus();
    await waitForLitRender(wrapper);

    expect(secondInput.checked).to.be.true;
    await sendKeys({ press: 'ArrowRight' });
    await sendKeys({ press: 'ArrowRight' });
    await waitForLitRender(wrapper);

    expect(document.activeElement!.id).to.be.equal(firstInput.id);
  };

  describe('with radio buttons', () => {
    let wrapper: SbbRadioButtonGroupElement;
    let firstPanel: SbbSelectionExpansionPanelElement;
    let firstInput: SbbRadioButtonPanelElement;
    let secondPanel: SbbSelectionExpansionPanelElement;
    let secondInput: SbbRadioButtonPanelElement;
    let disabledInput: SbbRadioButtonPanelElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didOpen);

      wrapper = await fixture(getPageContent('radio-button'), {
        modules: ['./selection-expansion-panel.ts', '../button.ts', '../radio-button.ts'],
      });
      elements = Array.from(wrapper.querySelectorAll('sbb-selection-expansion-panel'));
      firstPanel = wrapper.querySelector<SbbSelectionExpansionPanelElement>(
        '#sbb-selection-expansion-panel-1',
      )!;
      firstInput = wrapper.querySelector<SbbRadioButtonPanelElement>('#sbb-input-1')!;
      secondPanel = wrapper.querySelector<SbbSelectionExpansionPanelElement>(
        '#sbb-selection-expansion-panel-2',
      )!;
      secondInput = wrapper.querySelector<SbbRadioButtonPanelElement>('#sbb-input-2')!;
      disabledInput = wrapper.querySelector<SbbRadioButtonPanelElement>('#sbb-input-3')!;
    });

    it('renders', () => {
      elements.forEach((e) => assert.instanceOf(e, SbbSelectionExpansionPanelElement));
      assert.instanceOf(firstPanel, SbbSelectionExpansionPanelElement);
      assert.instanceOf(firstInput, SbbRadioButtonPanelElement);
      assert.instanceOf(secondPanel, SbbSelectionExpansionPanelElement);
      assert.instanceOf(secondInput, SbbRadioButtonPanelElement);
    });

    it('selects input on click and shows related content', async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didOpen);

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
      const fourthInput = wrapper.querySelector<SbbRadioButtonPanelElement>('#sbb-input-4')!;

      firstInput.click();
      firstInput.focus();
      await sendKeys({ press: 'ArrowLeft' });
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
      await sendKeys({ press: 'ArrowRight' });
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
      const wrapperNoContent = await fixture(
        html`
          <sbb-radio-button-group id="group-no-content" value="Value 2">
            <sbb-selection-expansion-panel id="no-content-1">
              <sbb-radio-button-panel id="input-no-content-1" value="Value 1"
                >Value one</sbb-radio-button-panel
              >
            </sbb-selection-expansion-panel>
            <sbb-selection-expansion-panel id="no-content-2">
              <sbb-radio-button-panel id="input-no-content-2" value="Value 2"
                >Value two</sbb-radio-button-panel
              >
            </sbb-selection-expansion-panel>
            <sbb-selection-expansion-panel id="no-content-3">
              <sbb-radio-button-panel id="input-no-content-3" value="Value 3" disabled
                >Value three</sbb-radio-button-panel
              >
            </sbb-selection-expansion-panel>
            <sbb-selection-expansion-panel id="no-content-4">
              <sbb-radio-button-panel id="input-no-content-4" value="Value 4"
                >Value four</sbb-radio-button-panel
              >
            </sbb-selection-expansion-panel>
          </sbb-radio-button-group>
        `,
        {
          modules: ['./selection-expansion-panel.ts', '../radio-button.ts'],
        },
      );
      const firstInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-1')!;
      const secondInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-2')!;
      const fourthInputNoContent =
        wrapperNoContent.querySelector<SbbRadioButtonElement>('#input-no-content-4')!;
      const firstPanel =
        wrapperNoContent.querySelector<SbbSelectionExpansionPanelElement>('#no-content-1')!;
      const secondPanel =
        wrapperNoContent.querySelector<SbbSelectionExpansionPanelElement>('#no-content-2')!;

      expect(firstPanel).to.have.attribute('data-state', 'closed');
      expect(secondPanel).to.have.attribute('data-state', 'closed');

      await sendKeys({ press: tabKey });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);

      await sendKeys({ press: 'ArrowUp' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(firstInputNoContent.id);
      expect(secondInputNoContent.checked).to.be.false;
      expect(firstInputNoContent.checked).to.be.true;

      await sendKeys({ press: 'ArrowRight' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);
      expect(firstInputNoContent.checked).to.be.false;
      expect(secondInputNoContent.checked).to.be.true;

      await sendKeys({ press: 'ArrowDown' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(fourthInputNoContent.id);
      expect(secondInputNoContent.checked).to.be.false;
      expect(fourthInputNoContent.checked).to.be.true;

      await sendKeys({ press: 'ArrowLeft' });
      await waitForLitRender(wrapperNoContent);
      expect(document.activeElement!.id).to.be.equal(secondInputNoContent.id);
      expect(fourthInputNoContent.checked).to.be.false;
      expect(secondInputNoContent.checked).to.be.true;
    });
  });

  describe('with nested radio buttons', () => {
    let nestedElement: SbbRadioButtonGroupElement;
    let panel1: SbbSelectionExpansionPanelElement;
    let panel2: SbbSelectionExpansionPanelElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;
    let willCloseEventSpy: EventSpy<Event>;
    let didCloseEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didOpen);
      willCloseEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willClose);
      didCloseEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didClose);

      nestedElement = await fixture(
        html`
          <sbb-radio-button-group orientation="vertical" horizontal-from="large">
            <!-- We need enabled animation to properly test that fade in animation was not shown -->
            <sbb-selection-expansion-panel id="panel1" class="sbb-enable-animation">
              <sbb-radio-button-panel value="main1" checked> Main Option 1 </sbb-radio-button-panel>
              <sbb-radio-button-group orientation="vertical" slot="content">
                <sbb-radio-button value="sub1" checked>Suboption 1</sbb-radio-button>
                <sbb-radio-button value="sub2">Suboption 2</sbb-radio-button>
              </sbb-radio-button-group>
            </sbb-selection-expansion-panel>

            <sbb-selection-expansion-panel id="panel2">
              <sbb-radio-button-panel value="main2"> Main Option 2 </sbb-radio-button-panel>
              <sbb-radio-button-group orientation="vertical" slot="content">
                <sbb-radio-button value="sub3">Suboption 3</sbb-radio-button>
                <sbb-radio-button value="sub4">Suboption 4</sbb-radio-button>
              </sbb-radio-button-group>
            </sbb-selection-expansion-panel>
          </sbb-radio-button-group>
        `,
        {
          modules: ['./selection-expansion-panel.ts', '../radio-button.ts'],
        },
      );
      panel1 = nestedElement.querySelector<SbbSelectionExpansionPanelElement>('#panel1')!;
      panel2 = nestedElement.querySelector<SbbSelectionExpansionPanelElement>('#panel2')!;
    });

    it('should display expanded label correctly', async () => {
      const mainRadioButton2: SbbRadioButtonPanelElement =
        nestedElement.querySelector<SbbRadioButtonPanelElement>(
          "sbb-radio-button-panel[value='main2']",
        )!;

      const mainRadioButton1Label = (await a11ySnapshot({
        selector: 'sbb-radio-button-panel[value="main1"]',
      })) as unknown as { name: string };

      const mainRadioButton2Label = (await a11ySnapshot({
        selector: 'sbb-radio-button-panel[value="main2"]',
      })) as unknown as { name: string };

      // We assert that there was no fade in animation (skipped opening state).
      await waitForCondition(() => panel1.getAttribute('data-state') === 'opening', 1, 100)
        .then(() => Promise.reject('accidentally passed'))
        .catch((error) => expect(error).to.include('timeout'));

      await waitForCondition(() => didOpenEventSpy.count === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(mainRadioButton1Label.name.trim()).to.be.equal('Main Option 1 , expanded');
      expect(mainRadioButton2Label.name.trim()).to.be.equal('Main Option 2 , collapsed');
      expect(panel1).to.have.attribute('data-state', 'opened');
      expect(panel2).to.have.attribute('data-state', 'closed');

      // Activate main option 2
      mainRadioButton2.click();

      await waitForCondition(() => didOpenEventSpy.count === 2);
      await waitForCondition(() => didCloseEventSpy.count === 1);

      const mainRadioButton1LabelSecondRender = (await a11ySnapshot({
        selector: 'sbb-radio-button-panel[value="main1"]',
      })) as unknown as { name: string };

      const mainRadioButton2LabelSecondRender = (await a11ySnapshot({
        selector: 'sbb-radio-button-panel[value="main2"]',
      })) as unknown as { name: string };

      expect(willOpenEventSpy.count).to.be.equal(2);
      expect(didOpenEventSpy.count).to.be.equal(2);
      expect(willCloseEventSpy.count).to.be.equal(1);
      expect(didCloseEventSpy.count).to.be.equal(1);
      expect(mainRadioButton1LabelSecondRender.name.trim()).to.be.equal(
        'Main Option 1 , collapsed',
      );
      expect(mainRadioButton2LabelSecondRender.name.trim()).to.be.equal('Main Option 2 , expanded');

      expect(panel1).to.have.attribute('data-state', 'closed');
      expect(panel2).to.have.attribute('data-state', 'opened');
    });

    it('should mark only outer group children as disabled', async () => {
      nestedElement.toggleAttribute('disabled', true);
      await waitForLitRender(nestedElement);

      const radioButtons: SbbRadioButtonPanelElement[] = Array.from(
        nestedElement.querySelectorAll('sbb-radio-button-panel, sbb-radio-button'),
      );

      expect(radioButtons.length).to.be.equal(6);
      expect(radioButtons[0]).to.have.attribute('disabled');
      expect(radioButtons[1]).not.to.have.attribute('disabled');
      expect(radioButtons[2]).not.to.have.attribute('disabled');
      expect(radioButtons[3]).to.have.attribute('disabled');
      expect(radioButtons[4]).not.to.have.attribute('disabled');
      expect(radioButtons[5]).not.to.have.attribute('disabled');
    });

    it('should not with interfere content on selection', async () => {
      const main1: SbbRadioButtonPanelElement =
        nestedElement.querySelector<SbbRadioButtonPanelElement>(
          'sbb-radio-button-panel[value="main1"]',
        )!;
      const main2: SbbRadioButtonPanelElement =
        nestedElement.querySelector<SbbRadioButtonPanelElement>(
          'sbb-radio-button-panel[value="main2"]',
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
      const root = await fixture(
        html`
          <div>
            <template>
              <sbb-selection-expansion-panel>
                <sbb-radio-button-panel value="main1" checked="true">
                  Main Option 1
                </sbb-radio-button-panel>
                <sbb-radio-button-group orientation="vertical" slot="content">
                  <sbb-radio-button value="sub1" checked>Suboption 1</sbb-radio-button>
                  <sbb-radio-button value="sub2">Suboption 2</sbb-radio-button>
                </sbb-radio-button-group>
              </sbb-selection-expansion-panel>

              <sbb-selection-expansion-panel>
                <sbb-radio-button-panel value="main2"> Main Option 2 </sbb-radio-button-panel>
                <sbb-radio-button-group orientation="vertical" slot="content">
                  <sbb-radio-button value="sub3">Suboption 3</sbb-radio-button>
                  <sbb-radio-button value="sub4">Suboption 4</sbb-radio-button>
                </sbb-radio-button-group>
              </sbb-selection-expansion-panel>
            </template>

            <sbb-radio-button-group value="main1"></sbb-radio-button-group>
          </div>
        `,
        {
          modules: ['./selection-expansion-panel.ts', '../radio-button.ts'],
        },
      );

      const radioGroup = root.querySelector<SbbRadioButtonGroupElement>('sbb-radio-button-group')!;
      const selectionPanels = Array.from(
        root.querySelector('template')!.content.querySelectorAll('sbb-selection-expansion-panel'),
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
    let firstPanel: SbbSelectionExpansionPanelElement;
    let firstInput: SbbCheckboxPanelElement;
    let secondPanel: SbbSelectionExpansionPanelElement;
    let secondInput: SbbCheckboxPanelElement;
    let disabledInput: SbbCheckboxPanelElement;
    let willOpenEventSpy: EventSpy<Event>;
    let didOpenEventSpy: EventSpy<Event>;
    let willCloseEventSpy: EventSpy<Event>;
    let didCloseEventSpy: EventSpy<Event>;

    beforeEach(async () => {
      willOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willOpen);
      didOpenEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didOpen);
      willCloseEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.willClose);
      didCloseEventSpy = new EventSpy(SbbSelectionExpansionPanelElement.events.didClose);

      wrapper = await fixture(getPageContent('checkbox'), {
        modules: ['./selection-expansion-panel.ts', '../button.ts', '../checkbox.ts'],
      });
      elements = Array.from(wrapper.querySelectorAll('sbb-selection-expansion-panel'));
      firstPanel = wrapper.querySelector<SbbSelectionExpansionPanelElement>(
        '#sbb-selection-expansion-panel-1',
      )!;
      firstInput = wrapper.querySelector<SbbCheckboxPanelElement>('#sbb-input-1')!;
      secondPanel = wrapper.querySelector<SbbSelectionExpansionPanelElement>(
        '#sbb-selection-expansion-panel-2',
      )!;
      secondInput = wrapper.querySelector<SbbCheckboxPanelElement>('#sbb-input-2')!;
      disabledInput = wrapper.querySelector<SbbCheckboxPanelElement>('#sbb-input-3')!;
    });

    it('renders', () => {
      elements.forEach((e) => assert.instanceOf(e, SbbSelectionExpansionPanelElement));

      assert.instanceOf(firstPanel, SbbSelectionExpansionPanelElement);
      assert.instanceOf(firstInput, SbbCheckboxPanelElement);
      assert.instanceOf(secondPanel, SbbSelectionExpansionPanelElement);
      assert.instanceOf(secondInput, SbbCheckboxPanelElement);
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
      const fourthInput: SbbCheckboxPanelElement =
        wrapper.querySelector<SbbCheckboxPanelElement>('#sbb-input-4')!;

      firstInput.click();
      firstInput.focus();
      await sendKeys({ press: 'ArrowLeft' });
      await waitForCondition(() => !firstInput.checked);
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
      await sendKeys({ press: 'ArrowRight' });
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
      nestedElement = await fixture(
        html`
          <sbb-checkbox-group orientation="vertical" horizontal-from="large">
            <sbb-selection-expansion-panel id="panel1">
              <sbb-checkbox-panel value="main1" checked> Main Option 1 </sbb-checkbox-panel>
              <sbb-checkbox-group orientation="vertical" slot="content">
                <sbb-checkbox value="sub1" checked>Suboption 1</sbb-checkbox>
                <sbb-checkbox value="sub2">Suboption 2</sbb-checkbox>
              </sbb-checkbox-group>
            </sbb-selection-expansion-panel>

            <sbb-selection-expansion-panel id="panel2">
              <sbb-checkbox-panel value="main2"> Main Option 2 </sbb-checkbox-panel>
              <sbb-checkbox-group orientation="vertical" slot="content">
                <sbb-checkbox value="sub3">Suboption 3</sbb-checkbox>
                <sbb-checkbox value="sub4">Suboption 4</sbb-checkbox>
              </sbb-checkbox-group>
            </sbb-selection-expansion-panel>
          </sbb-checkbox-group>
        `,
        { modules: ['../checkbox.ts', './selection-expansion-panel.ts'] },
      );
    });

    it('should display expanded label correctly', async () => {
      const mainCheckbox1: SbbCheckboxPanelElement =
        nestedElement.querySelector<SbbCheckboxPanelElement>("sbb-checkbox-panel[value='main1']")!;
      const mainCheckbox2: SbbCheckboxPanelElement =
        nestedElement.querySelector<SbbCheckboxPanelElement>("sbb-checkbox-panel[value='main2']")!;

      const mainCheckbox1Label = (await a11ySnapshot({
        selector: 'sbb-checkbox-panel[value="main1"]',
      })) as unknown as { name: string };

      const mainCheckbox2Label = (await a11ySnapshot({
        selector: 'sbb-checkbox-panel[value="main2"]',
      })) as unknown as { name: string };

      expect(mainCheckbox1Label.name.trim()).to.be.equal('​ Main Option 1 , expanded');
      expect(mainCheckbox2Label.name.trim()).to.be.equal('​ Main Option 2 , collapsed');

      // Deactivate main option 1
      mainCheckbox1.click();

      // Activate main option 2
      mainCheckbox2.click();

      await waitForLitRender(nestedElement);

      const mainCheckbox1LabelSecondRender = (await a11ySnapshot({
        selector: 'sbb-checkbox-panel[value="main1"]',
      })) as unknown as { name: string };

      const mainCheckbox2LabelSecondRender = (await a11ySnapshot({
        selector: 'sbb-checkbox-panel[value="main2"]',
      })) as unknown as { name: string };

      expect(mainCheckbox1LabelSecondRender.name.trim()).to.be.equal('​ Main Option 1 , collapsed');
      expect(mainCheckbox2LabelSecondRender.name.trim()).to.be.equal('​ Main Option 2 , expanded');
    });

    it('should mark only outer group children as disabled', async () => {
      nestedElement.toggleAttribute('disabled', true);
      await waitForLitRender(nestedElement);

      const checkboxes: (SbbCheckboxPanelElement | SbbCheckboxElement)[] = Array.from(
        nestedElement.querySelectorAll('sbb-checkbox-panel, sbb-checkbox'),
      );

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
