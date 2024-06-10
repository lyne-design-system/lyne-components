import { assert, aTimeout, expect } from '@open-wc/testing';
import { sendKeys, sendMouse, setViewport } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import type { SbbButtonElement } from '../../button.js';
import { fixture } from '../../core/testing/private.js';
import { waitForCondition, waitForLitRender, EventSpy } from '../../core/testing.js';

import { SbbPopoverElement } from './popover.js';

import '../../button/button.js';
import '../../link.js';

describe(`sbb-popover`, () => {
  let element: SbbPopoverElement, trigger: SbbButtonElement;

  describe('with interactive content', () => {
    beforeEach(async () => {
      const content = await fixture(html`
        <span>
          <sbb-button id="popover-trigger">Popover trigger</sbb-button>
          <sbb-popover id="popover" trigger="popover-trigger">
            Popover content.
            <sbb-link id="popover-link" href="#" sbb-popover-close>Link</sbb-link>
          </sbb-popover>
          <sbb-block-link href="#" id="interactive-background-element"
            >Other interactive element</sbb-block-link
          >
        </span>
      `);
      trigger = content.querySelector<SbbButtonElement>('sbb-button')!;
      element = content.querySelector<SbbPopoverElement>('sbb-popover')!;
    });

    it('renders', () => {
      assert.instanceOf(element, SbbPopoverElement);
    });

    it('shows the popover', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);

      element.open();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'opened');
    });

    it('shows on trigger click', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);

      trigger.click();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'opened');
    });

    it('closes the popover', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.willClose);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);

      element.open();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(element).to.have.attribute('data-state', 'opened');

      element.close();

      await waitForCondition(() => willCloseEventSpy.events.length === 1);
      expect(willCloseEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);
      expect(element).to.have.attribute('data-state', 'closed');
    });

    it('closes the popover on close button click', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.willClose);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);
      const closeButton = element.shadowRoot!.querySelector<HTMLElement>('[sbb-popover-close]')!;

      element.open();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(element).to.have.attribute('data-state', 'opened');

      closeButton!.click();

      await waitForCondition(() => willCloseEventSpy.events.length === 1);
      expect(willCloseEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'closed');
      expect(trigger).to.have.attribute('data-focus-origin', 'mouse');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('closes on interactive element click', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.willClose);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);
      const popoverLink = element.querySelector(':scope > sbb-link') as HTMLElement;

      trigger.click();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'opened');
      expect(popoverLink).not.to.be.null;

      popoverLink.click();

      await waitForCondition(() => willCloseEventSpy.events.length === 1);
      expect(willCloseEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'closed');
      expect(trigger).to.have.attribute('data-focus-origin', 'mouse');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('is correctly positioned on screen', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);

      await setViewport({ width: 1200, height: 800 });

      trigger.click();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(element).to.have.attribute('data-state', 'opened');

      const buttonHeight = getComputedStyle(document.documentElement).getPropertyValue(
        `--sbb-size-element-m`,
      );
      expect(buttonHeight.trim()).to.be.equal('3.5rem');

      const buttonHeightPx = parseFloat(buttonHeight) * 16;
      expect(trigger.offsetHeight).to.be.equal(buttonHeightPx);
      expect(trigger.offsetTop).to.be.equal(0);
      expect(trigger.offsetLeft).to.be.equal(0);

      // Expect overlay offsetTop to be equal to the trigger height + the overlay offset (8px)
      const popoverOverlay = element.shadowRoot!.querySelector<HTMLElement>('.sbb-popover')!;
      expect(popoverOverlay.offsetTop).to.be.equal(buttonHeightPx + 16);
      expect(popoverOverlay.offsetLeft).to.be.equal(0);
    });

    it('should set correct focus attribute on trigger after backdrop click', async () => {
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);

      element.open();

      await waitForCondition(() => didOpenEventSpy.events.length === 1);

      // Simulate backdrop click
      window.dispatchEvent(new MouseEvent('mousedown', { buttons: 1, clientX: 1 }));
      window.dispatchEvent(new PointerEvent('pointerup'));

      await waitForCondition(() => didCloseEventSpy.events.length === 1);

      expect(trigger).to.have.attribute('data-focus-origin', 'mouse');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('should set correct focus attribute on trigger after backdrop click on an interactive element', async () => {
      const interactiveBackgroundElement = element.parentElement!.querySelector(
        '#interactive-background-element',
      ) as HTMLElement;
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);

      element.open();

      await waitForCondition(() => didOpenEventSpy.events.length === 1);

      const interactiveElementPosition = interactiveBackgroundElement.getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [
          Math.round(interactiveElementPosition.x + interactiveElementPosition.width / 2),
          Math.round(interactiveElementPosition.y + interactiveElementPosition.height / 2),
        ],
      });
      await waitForCondition(() => didCloseEventSpy.events.length === 1);

      expect(document.activeElement!.id).to.be.equal('interactive-background-element');
    });

    it('closes on interactive element click by keyboard', async () => {
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);
      const popoverLink = element.querySelector(':scope > sbb-link') as HTMLElement;

      trigger.click();

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);

      expect(popoverLink).not.to.be.null;

      popoverLink.focus();
      await sendKeys({ down: 'Enter' });

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(trigger).to.have.attribute('data-focus-origin', 'keyboard');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('sets the focus to the first focusable element when the popover is opened by keyboard', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);

      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'Enter' });

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      expect(element).to.have.attribute('data-state', 'opened');

      expect(document.activeElement!.id).to.be.equal('popover');
      expect(
        document.activeElement!.shadowRoot!.activeElement ===
          document.activeElement!.shadowRoot!.querySelector('[sbb-popover-close]'),
      ).to.be.equal(true);
    });

    it('closes the popover on close button click by keyboard', async () => {
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);
      const closeButton = document
        .querySelector('sbb-popover')!
        .shadowRoot!.querySelector<HTMLElement>('[sbb-popover-close]')!;

      element.open();

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);
      await waitForLitRender(element);

      closeButton.focus();
      await sendKeys({ down: 'Enter' });

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(trigger).to.have.attribute('data-focus-origin', 'keyboard');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('closes on Esc keypress', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.willClose);
      const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);

      trigger.click();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      expect(didOpenEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'opened');

      await sendKeys({ down: 'Tab' });
      await sendKeys({ down: 'Escape' });

      await waitForCondition(() => willCloseEventSpy.events.length === 1);
      expect(willCloseEventSpy.count).to.be.equal(1);

      await waitForCondition(() => didCloseEventSpy.events.length === 1);
      expect(didCloseEventSpy.count).to.be.equal(1);

      expect(element).to.have.attribute('data-state', 'closed');
      expect(trigger).to.have.attribute('data-focus-origin', 'keyboard');
      expect(document.activeElement!.id).to.be.equal('popover-trigger');
    });

    it('does not open if prevented', async () => {
      const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.willOpen);

      element.addEventListener(SbbPopoverElement.events.willOpen, (ev) => ev.preventDefault());
      element.open();

      await waitForCondition(() => willOpenEventSpy.events.length === 1);
      expect(willOpenEventSpy.count).to.be.equal(1);
      await waitForLitRender(element);

      expect(element).to.have.attribute('data-state', 'closed');
    });

    it('does not close if prevented', async () => {
      const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
      const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.willClose);

      element.open();
      await waitForCondition(() => didOpenEventSpy.events.length === 1);
      await waitForLitRender(element);

      element.addEventListener(SbbPopoverElement.events.willClose, (ev) => ev.preventDefault());
      element.close();

      await waitForCondition(() => willCloseEventSpy.events.length === 1);
      await waitForLitRender(element);

      expect(element).to.have.attribute('data-state', 'opened');
    });

    it('should update config when changing hoverTrigger', async () => {
      // Assert trigger click ok
      trigger.click();
      await waitForCondition(() => element.getAttribute('data-state') === 'opened');
      element.close();
      await waitForCondition(() => element.getAttribute('data-state') === 'closed');

      // Assert hover does not trigger
      trigger.dispatchEvent(new Event('mouseenter'));
      await aTimeout(100);
      expect(element).to.have.attribute('data-state', 'closed');

      // Change to hover trigger
      element.hoverTrigger = true;
      await waitForLitRender(element);

      // Assert hover does trigger opening
      trigger.dispatchEvent(new Event('mouseenter'));
      await waitForCondition(() => element.getAttribute('data-state') === 'opened');

      // Close again
      element.close();
      await waitForCondition(() => element.getAttribute('data-state') === 'closed');

      // Assert click does not trigger
      trigger.click();
      await aTimeout(100);
      expect(element).to.have.attribute('data-state', 'closed');
    });
  });

  describe('with no interactive content', () => {
    let content: HTMLElement;

    beforeEach(async () => {
      content = await fixture(html`
        <span>
          <sbb-button id="popover-trigger">Popover trigger</sbb-button>
          <sbb-popover id="popover" trigger="popover-trigger" hide-close-button>
            Popover content.
          </sbb-popover>
          <sbb-block-link href="#" id="interactive-background-element"
            >Other interactive element</sbb-block-link
          >
        </span>
      `);
      trigger = content.querySelector<SbbButtonElement>('sbb-button')!;
      element = content.querySelector<SbbPopoverElement>('sbb-popover')!;
    });

    it('should focus content container if no interactive content present', async () => {
      const popoverContainer = element.shadowRoot!.querySelector('.sbb-popover');

      // When opening by keyboard
      trigger.focus();
      await sendKeys({ press: 'Space' });

      // Then popover opens and focuses container
      await waitForCondition(() => element.getAttribute('data-state') === 'opened');
      expect(document.activeElement!.shadowRoot!.activeElement).to.equal(popoverContainer);
      expect(popoverContainer).to.have.attribute('tabindex', '0');

      // When tabbing away
      await sendKeys({ press: 'Tab' });

      // Then popover should close, next element should be focused and popover container be reset.
      await waitForCondition(() => element.getAttribute('data-state') === 'closed');
      expect(document.activeElement).to.equal(
        content.querySelector('#interactive-background-element'),
      );
      expect(popoverContainer).not.to.have.attribute('tabindex');
    });

    it('should remove tabindex when closing with esc', async () => {
      const popoverContainer = element.shadowRoot!.querySelector('.sbb-popover');

      // When opening by keyboard
      trigger.focus();
      await sendKeys({ press: 'Space' });

      // Then popover opens and focuses container
      await waitForCondition(() => element.getAttribute('data-state') === 'opened');
      expect(document.activeElement!.shadowRoot!.activeElement).to.equal(popoverContainer);
      expect(popoverContainer).to.have.attribute('tabindex', '0');

      // When pressing escape key
      await sendKeys({ press: 'Escape' });

      // Then popover should close, trigger should be focused and popover container be reset.
      await waitForCondition(() => element.getAttribute('data-state') === 'closed');
      expect(document.activeElement).to.equal(trigger);
      expect(popoverContainer).not.to.have.attribute('tabindex');
    });
  });

  it('should close an open popover when another one is opened', async () => {
    const root = await fixture(html`
      <div>
        <sbb-block-link href="#somewhere" id="interactive-background-element"
          >Other interactive element</sbb-block-link
        >
        <sbb-button id="popover-trigger">Popover trigger</sbb-button>
        <sbb-button id="another-popover-trigger">Another popover trigger</sbb-button>
        <sbb-popover id="popover" trigger="popover-trigger"> Popover content. </sbb-popover>
        <sbb-popover id="another-popover" trigger="another-popover-trigger">
          Another popover content.
        </sbb-popover>
      </div>
    `);
    trigger = root.querySelector<SbbButtonElement>('#popover-trigger')!;
    element = root.querySelector<SbbPopoverElement>('#popover')!;
    const secondTrigger = root.querySelector<SbbButtonElement>('#another-popover-trigger');
    const secondElement = root.querySelector<SbbPopoverElement>('#another-popover');

    const willOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
    const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen);
    const willCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose);
    const didCloseEventSpy = new EventSpy(SbbPopoverElement.events.didClose, element);

    expect(secondTrigger).not.to.be.null;
    expect(secondElement).not.to.be.null;

    trigger.focus();
    await sendKeys({ press: 'Space' });

    await waitForCondition(() => willOpenEventSpy.events.length === 1);
    expect(willOpenEventSpy.count).to.be.equal(1);

    await waitForCondition(() => didOpenEventSpy.events.length === 1);

    expect(didOpenEventSpy.count).to.be.equal(1);
    expect(element).to.have.attribute('data-state', 'opened');

    trigger.focus();
    await sendKeys({ press: 'Tab' });

    expect(document.activeElement!.id).to.be.equal('another-popover-trigger');

    await sendKeys({ press: 'Space' });

    await waitForCondition(() => willCloseEventSpy.events.length === 1);
    expect(willCloseEventSpy.count).to.be.equal(1);

    await waitForCondition(() => didCloseEventSpy.events.length === 1);
    expect(didCloseEventSpy.count).to.be.equal(1);
    expect(element).to.have.attribute('data-state', 'closed');

    await waitForCondition(() => willOpenEventSpy.events.length === 2);
    expect(willOpenEventSpy.count).to.be.equal(2);

    await waitForCondition(() => didOpenEventSpy.events.length === 2);
    expect(didOpenEventSpy.count).to.be.equal(2);
    expect(secondElement).to.have.attribute('data-state', 'opened');
  });
});
