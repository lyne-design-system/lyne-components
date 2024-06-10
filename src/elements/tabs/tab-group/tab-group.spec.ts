import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';
import type { SbbTabTitleElement } from '../tab-title.js';

import { SbbTabGroupElement } from './tab-group.js';

import '../tab-title.js';

describe(`sbb-tab-group`, () => {
  let element: SbbTabGroupElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-tab-group initial-selected-index="1">
        <sbb-tab-title id="sbb-tab-1">Test tab label 1</sbb-tab-title>
        <div>Test tab content 1</div>
        <sbb-tab-title id="sbb-tab-2">Test tab label 2</sbb-tab-title>
        <div>Test tab content 2</div>
        <sbb-tab-title id="sbb-tab-3" disabled>Test tab label 3</sbb-tab-title>
        <div>Test tab content 3</div>
        <sbb-tab-title id="sbb-tab-4">Test tab label 4</sbb-tab-title>
      </sbb-tab-group>`,
    );
  });

  it('renders', () => {
    assert.instanceOf(element, SbbTabGroupElement);
  });

  it('renders tab content', async () => {
    const content = element.querySelector<HTMLDivElement>(
      ':scope > sbb-tab-title:first-of-type + div',
    )!;

    expect(content.textContent).to.be.equal('Test tab content 1');
  });

  it('renders no content tab panel', async () => {
    const content = element.querySelector<HTMLDivElement>(
      ':scope > sbb-tab-title#sbb-tab-4 + div',
    )!;

    expect(content.textContent).to.be.equal('No content.');
  });

  it('renders initial selected index', async () => {
    const initialSelectedTab = element.querySelector(':scope > sbb-tab-title#sbb-tab-2');

    expect(initialSelectedTab).to.have.attribute('active');
  });

  it('activates tab by index', async () => {
    element.activateTab(1);
    await waitForLitRender(element);
    const tab = element.querySelectorAll('sbb-tab-title')[1];

    expect(tab).to.have.attribute('active');
  });

  it('disables tab by index', async () => {
    element.disableTab(0);
    await waitForLitRender(element);
    const tab = element.querySelectorAll('sbb-tab-title')[0];

    expect(tab).to.have.attribute('disabled');
  });

  it('enables tab by index', async () => {
    element.enableTab(2);
    await waitForLitRender(element);
    const tab = element.querySelectorAll('sbb-tab-title')[2];

    expect(tab).not.to.have.attribute('disabled');
  });

  it('does not activate a disabled tab', async () => {
    const tab = element.querySelectorAll('sbb-tab-title')[2];

    tab.disabled = true;
    element.activateTab(2);
    await waitForLitRender(element);
    expect(tab).not.to.have.attribute('active');
  });

  it('activates the first tab', () => {
    const tab = element.querySelectorAll('sbb-tab-title')[1];

    expect(tab).to.have.attribute('active');
  });

  describe('events', () => {
    it('selects tab on click', async () => {
      const tab = element.querySelector<SbbTabTitleElement>(':scope > sbb-tab-title#sbb-tab-1')!;

      tab.click();
      expect(tab).to.have.attribute('active');
    });

    it('dispatches event on tab change', async () => {
      const tab = element.querySelector<SbbTabTitleElement>(':scope > sbb-tab-title#sbb-tab-1')!;
      const changeSpy = new EventSpy(SbbTabGroupElement.events.didChange);

      tab.click();
      await waitForCondition(() => changeSpy.events.length === 1);
      expect(changeSpy.count).to.be.equal(1);
    });

    it('selects tab on left arrow key pressed', async () => {
      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'ArrowLeft' });
      const tab = element.querySelector(':scope > sbb-tab-title#sbb-tab-1');

      expect(tab).to.have.attribute('active');
    });

    it('selects tab on right arrow key pressed', async () => {
      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'ArrowRight' });
      const tab = element.querySelector(':scope > sbb-tab-title#sbb-tab-4');

      expect(tab).to.have.attribute('active');
    });

    it('wraps around on arrow key navigation', async () => {
      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'ArrowRight' });
      await sendKeys({ down: 'ArrowRight' });
      const tab = element.querySelector(':scope > sbb-tab-title#sbb-tab-1');

      expect(tab).to.have.attribute('active');
    });

    it('wraps around on arrow left arrow key navigation', async () => {
      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'ArrowLeft' });
      await sendKeys({ down: 'ArrowLeft' });
      const tab = element.querySelector(':scope > sbb-tab-title#sbb-tab-4');

      expect(tab).to.have.attribute('active');
    });
  });

  it('activates the first enabled tab if exceeds the length of the tab group', async () => {
    element = await fixture(
      html` <sbb-tab-group initial-selected-index="2">
        <sbb-tab-title id="sbb-tab-1">Test tab label 1</sbb-tab-title>
        <div>Test tab content 1</div>
        <sbb-tab-title id="sbb-tab-2">Test tab label 2</sbb-tab-title>
        <div>Test tab content 2</div>
      </sbb-tab-group>`,
    );
    const tab = element.querySelector('sbb-tab-title#sbb-tab-1');
    expect(tab).to.have.attribute('active');
  });

  it('activates the first enabled tab if targets a disabled tab', async () => {
    element = await fixture(
      html` <sbb-tab-group initial-selected-index="0">
        <sbb-tab-title disabled>Test tab label 1</sbb-tab-title>
        <div>Test tab content 1</div>
        <sbb-tab-title id="sbb-tab-2">Test tab label 2</sbb-tab-title>
        <div>Test tab content 2</div>
      </sbb-tab-group>`,
    );
    const tab = element.querySelector('sbb-tab-title#sbb-tab-2');
    expect(tab).to.have.attribute('active');
  });
});
