import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { EventSpy, waitForLitRender } from '../core/testing.js';

import { SbbSliderElement } from './slider.js';

const keyboardPressTimes = async (
  slider: SbbSliderElement,
  key: string,
  times = 1,
): Promise<void> => {
  slider.focus();
  for (let i = 0; i < times; i++) {
    await sendKeys({ press: key });
  }
  await waitForLitRender(slider);
};

describe(`sbb-slider`, () => {
  let element: SbbSliderElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-slider
        start-icon="walk-slow-small"
        end-icon="walk-fast-small"
        max="500"
        min="100"
        value="400"
      ></sbb-slider>
    `);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbSliderElement);
  });

  it('should decrease value by two on left arrow keypress', async () => {
    const changeEvent = new EventSpy('change', element);
    await keyboardPressTimes(element, 'ArrowLeft', 2);
    expect(changeEvent.count).to.be.greaterThan(0);
    expect(element.value).to.be.equal('398');
    expect(element.valueAsNumber).to.be.equal(398);
  });

  it('should decrease value by two on down arrow keypress', async () => {
    const changeEvent = new EventSpy('change', element);
    await keyboardPressTimes(element, 'ArrowDown', 2);
    expect(changeEvent.count).to.be.greaterThan(0);
    expect(element.value).to.be.equal('398');
    expect(element.valueAsNumber).to.be.equal(398);
  });

  it('should increase value by one on right arrow keypress', async () => {
    const changeEvent = new EventSpy('change', element);
    await keyboardPressTimes(element, 'ArrowRight');
    expect(changeEvent.count).to.be.greaterThan(0);
    expect(element.value).to.be.equal('401');
    expect(element.valueAsNumber).to.be.equal(401);
  });

  it('should increase value by one on up arrow keypress', async () => {
    const changeEvent = new EventSpy('change', element);
    await keyboardPressTimes(element, 'ArrowUp');
    expect(changeEvent.count).to.be.greaterThan(0);
    expect(element.value).to.be.equal('401');
    expect(element.valueAsNumber).to.be.equal(401);
  });

  it('should not change value on arrow keypress if disabled', async () => {
    const changeEvent = new EventSpy('change', element);
    element.toggleAttribute('disabled', true);
    await keyboardPressTimes(element, 'ArrowLeft');
    expect(changeEvent.count).not.to.be.greaterThan(0);
    await keyboardPressTimes(element, 'ArrowRight');
    expect(changeEvent.count).not.to.be.greaterThan(0);
    await keyboardPressTimes(element, 'ArrowUp');
    expect(changeEvent.count).not.to.be.greaterThan(0);
    await keyboardPressTimes(element, 'ArrowDown');
    expect(changeEvent.count).not.to.be.greaterThan(0);
  });
});
