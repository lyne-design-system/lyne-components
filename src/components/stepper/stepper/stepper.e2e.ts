import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing';
import { SbbStepElement } from '../step/step';
import type { SbbStepLabelElement } from '../step-label';

import { SbbStepperElement } from './stepper';
import '../step-label';
import '../step';

describe('sbb-stepper', () => {
  let element: SbbStepperElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-stepper>
        <sbb-step-label>Step 1</sbb-step-label>
        <sbb-step>
          Step one content.
          <span sbb-stepper-next>Next</span>
        </sbb-step>

        <sbb-step-label>Step 2</sbb-step-label>
        <sbb-step>
          Step two content.
          <span sbb-stepper-next>Next</span>
          <span sbb-stepper-previous>Back</span>
        </sbb-step>

        <sbb-step-label>Step 3</sbb-step-label>
        <sbb-step>
          Step three content.
          <span sbb-stepper-previous>Back</span>
        </sbb-step>
      </sbb-stepper>
    `);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbStepperElement);
  });

  it('selects the first step by default', async () => {
    const stepLabelOne = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(1)',
    )!;

    await waitForLitRender(element);
    expect(stepLabelOne).to.have.attribute('data-selected');
  });

  it('selects the correct step on label click and emits validate event', async () => {
    const stepLabelThree = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(3)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    stepLabelThree.click();
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelThree).to.have.attribute('data-selected');
    expect(stepLabelThree.step).to.have.attribute('data-selected');
  });

  it('selects the correct step via `selected` and emits validate event', async () => {
    const stepLabelThree = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(3)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    element.selected = stepLabelThree.step!;
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelThree).to.have.attribute('data-selected');
    expect(stepLabelThree.step).to.have.attribute('data-selected');
  });

  it('selects the correct step via `selectedIndex` and emits validate event', async () => {
    const stepLabelThree = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(3)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    element.selectedIndex = 2;
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelThree).to.have.attribute('data-selected');
    expect(stepLabelThree.step).to.have.attribute('data-selected');
  });

  it('selects the next step on [sbb-stepper-next] click and emits validate event', async () => {
    const stepperNext = element.querySelector<HTMLElement>('[sbb-stepper-next]')!;
    const stepLabelTwo = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(2)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    stepperNext.click();
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelTwo).to.have.attribute('data-selected');
    expect(stepLabelTwo.step).to.have.attribute('data-selected');
  });

  it('selects the previous step on [sbb-stepper-previous] click', async () => {
    const stepperNext = element.querySelector<HTMLElement>('[sbb-stepper-next]')!;
    const stepperPrevious = element.querySelector<HTMLElement>('[sbb-stepper-previous]')!;
    const stepLabelOne = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(1)',
    )!;
    const stepLabelTwo = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(2)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    stepperNext.click();
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelTwo).to.have.attribute('data-selected');
    expect(stepLabelTwo.step).to.have.attribute('data-selected');

    stepperPrevious.click();
    await waitForLitRender(element);

    expect(stepLabelOne).to.have.attribute('data-selected');
    expect(stepLabelOne.step).to.have.attribute('data-selected');
  });

  it('does not switch to the next step if the validate is prevented', async () => {
    const stepLabelThree = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(3)',
    )!;
    const validate = new EventSpy(SbbStepElement.events.validate);

    element.addEventListener(SbbStepElement.events.validate, (ev) => ev.preventDefault());

    stepLabelThree.click();
    await waitForLitRender(element);

    await waitForCondition(() => validate.events.length === 1);
    expect(validate.count).to.be.equal(1);
    expect(stepLabelThree).not.to.have.attribute('data-selected');
    expect(stepLabelThree.step).not.to.have.attribute('data-selected');
  });

  it('resets the single form wrapping the stepper and returns to the first step', async () => {
    element = await fixture(html`
      <form>
        <sbb-stepper selected-index="0">
          <sbb-step-label>Step 1</sbb-step-label>
          <sbb-step>
            Step one content.
            <input name="first-input" />
          </sbb-step>

          <sbb-step-label>Step 2</sbb-step-label>
          <sbb-step>Step two content.</sbb-step>

          <sbb-step-label>Step 3</sbb-step-label>
          <sbb-step>
            Step three content.
            <input name="second-input" />
          </sbb-step>
        </sbb-stepper>
      </form>
    `);

    const stepLabelOne = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(1)',
    )!;
    const stepInputOne = element.querySelector<HTMLInputElement>('input[name="first-input"]')!;
    const stepInputTwo = element.querySelector<HTMLInputElement>('input[name="second-input"]')!;

    element.selectedIndex = 2;

    stepInputOne.value = 'First value';
    stepInputTwo.value = 'Second value';

    element.reset();
    await waitForLitRender(element);

    expect(stepInputOne.value).to.be.equal('');
    expect(stepInputTwo.value).to.be.equal('');

    expect(stepLabelOne).to.have.attribute('data-selected');
    expect(stepLabelOne.step).to.have.attribute('data-selected');
  });

  it('resets the form for each and returns to the first step', async () => {
    element = await fixture(html`
      <sbb-stepper selected-index="0">
        <sbb-step-label>Step 1</sbb-step-label>
        <sbb-step>
          Step one content.
          <form>
            <input name="first-input" />
          </form>
        </sbb-step>

        <sbb-step-label>Step 2</sbb-step-label>
        <sbb-step>Step two content.</sbb-step>

        <sbb-step-label>Step 3</sbb-step-label>
        <sbb-step>
          Step three content.
          <form>
            <input name="second-input" />
          </form>
        </sbb-step>
      </sbb-stepper>
    `);

    const stepLabelOne = element.querySelector<SbbStepLabelElement>(
      'sbb-step-label:nth-of-type(1)',
    )!;
    const stepInputOne = element.querySelector<HTMLInputElement>('input[name="first-input"]')!;
    const stepInputTwo = element.querySelector<HTMLInputElement>('input[name="second-input"]')!;

    element.selectedIndex = 2;

    stepInputOne.value = 'First value';
    stepInputTwo.value = 'Second value';

    element.reset();
    await waitForLitRender(element);

    expect(stepInputOne.value).to.be.equal('');
    expect(stepInputTwo.value).to.be.equal('');

    expect(stepLabelOne).to.have.attribute('data-selected');
    expect(stepLabelOne.step).to.have.attribute('data-selected');
  });
});
