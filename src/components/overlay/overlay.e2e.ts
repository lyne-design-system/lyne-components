import { assert, expect, fixture } from '@open-wc/testing';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { i18nDialog } from '../core/i18n';
import { EventSpy, waitForCondition, waitForLitRender } from '../core/testing';

import { SbbOverlayElement } from './overlay';
import '../button';
import '../icon';

async function openOverlay(element: SbbOverlayElement): Promise<void> {
  const willOpen = new EventSpy(SbbOverlayElement.events.willOpen);
  const didOpen = new EventSpy(SbbOverlayElement.events.didOpen);

  element.open();
  await waitForLitRender(element);

  await waitForCondition(() => willOpen.events.length === 1);
  expect(willOpen.count).to.be.equal(1);
  await waitForLitRender(element);

  await waitForCondition(() => didOpen.events.length === 1);
  expect(didOpen.count).to.be.equal(1);
  await waitForLitRender(element);

  expect(element).to.have.attribute('data-state', 'opened');
}

describe('sbb-overlay', () => {
  let element: SbbOverlayElement, ariaLiveRef: HTMLElement;

  beforeEach(async () => {
    await setViewport({ width: 900, height: 600 });
    element = await fixture(html`
      <sbb-overlay id="my-overlay-1" accessibility-label="Label" disable-animation>
        <p>Overlay content</p>
      </sbb-overlay>
    `);
    ariaLiveRef = element.shadowRoot!.querySelector('sbb-screen-reader-only')!;
  });

  it('renders', () => {
    assert.instanceOf(element, SbbOverlayElement);
  });

  it('opens the overlay', async () => {
    await openOverlay(element);
  });

  it('does not open the overlay if prevented', async () => {
    const willOpen = new EventSpy(SbbOverlayElement.events.willOpen);
    const didOpen = new EventSpy(SbbOverlayElement.events.didOpen);

    element.addEventListener(SbbOverlayElement.events.willOpen, (ev) => ev.preventDefault());

    element.open();
    await waitForLitRender(element);

    await waitForCondition(() => willOpen.events.length === 1);
    expect(willOpen.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(didOpen.count).to.be.equal(0);
    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('closes the overlay', async () => {
    const willClose = new EventSpy(SbbOverlayElement.events.willClose);
    const didClose = new EventSpy(SbbOverlayElement.events.didClose);

    await openOverlay(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Label`);

    element.close();
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'closed');
    expect(ariaLiveRef.textContent).to.be.equal('');
  });

  it('does not close the overlay if prevented', async () => {
    const willClose = new EventSpy(SbbOverlayElement.events.willClose);
    const didClose = new EventSpy(SbbOverlayElement.events.didClose);

    await openOverlay(element);

    element.addEventListener(SbbOverlayElement.events.willClose, (ev) => ev.preventDefault());

    element.close();
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(didClose.count).to.be.equal(0);
    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('closes the overlay on close button click', async () => {
    const closeButton = element.shadowRoot!.querySelector('[sbb-overlay-close]') as HTMLElement;
    const willClose = new EventSpy(SbbOverlayElement.events.willClose);
    const didClose = new EventSpy(SbbOverlayElement.events.didClose);

    await openOverlay(element);

    closeButton.click();
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('closes the overlay on Esc key press', async () => {
    const willClose = new EventSpy(SbbOverlayElement.events.willClose);
    const didClose = new EventSpy(SbbOverlayElement.events.didClose);

    await openOverlay(element);

    await sendKeys({ down: 'Tab' });
    await waitForLitRender(element);

    await sendKeys({ down: 'Escape' });
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('closes stacked overlays one by one on ESC key pressed', async () => {
    element = await fixture(html`
      <sbb-overlay id="my-overlay-3" disable-animation>
        <p>Overlay content</p>
      </sbb-overlay>

      <sbb-overlay id="stacked-overlay" disable-animation>
        <p>Stacked overlay content</p>
      </sbb-overlay>
    `);

    const willOpen = new EventSpy(SbbOverlayElement.events.willOpen);
    const didOpen = new EventSpy(SbbOverlayElement.events.didOpen);
    const willClose = new EventSpy(SbbOverlayElement.events.willClose);
    const didClose = new EventSpy(SbbOverlayElement.events.didClose);

    await openOverlay(element);

    const stackedOverlay = document.querySelector('#stacked-overlay') as SbbOverlayElement;

    stackedOverlay.open();
    await waitForLitRender(element);

    await waitForCondition(() => willOpen.events.length === 2);
    expect(willOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    await waitForCondition(() => didOpen.events.length === 2);
    expect(didOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    expect(stackedOverlay).to.have.attribute('data-state', 'opened');

    await sendKeys({ down: 'Tab' });
    await waitForLitRender(element);

    await sendKeys({ down: 'Escape' });
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(stackedOverlay).to.have.attribute('data-state', 'closed');
    expect(element).to.have.attribute('data-state', 'opened');

    await sendKeys({ down: 'Tab' });
    await waitForLitRender(element);

    await sendKeys({ down: 'Escape' });
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 2);
    expect(willClose.count).to.be.equal(2);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 2);
    expect(didClose.count).to.be.equal(2);
    await waitForLitRender(element);

    expect(stackedOverlay).to.have.attribute('data-state', 'closed');
    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('should remove ariaLiveRef content on any keyboard interaction', async () => {
    await openOverlay(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Label`);

    await sendKeys({ down: 'Tab' });
    await waitForLitRender(element);

    expect(ariaLiveRef.textContent!.trim()).to.be.equal('');
  });

  it('should remove ariaLiveRef content on any click interaction', async () => {
    await openOverlay(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Label`);

    element.click();
    await waitForLitRender(element);

    expect(ariaLiveRef.textContent).to.be.equal('');
  });

  it('should announce accessibility label in ariaLiveRef if explicitly set', async () => {
    element.accessibilityLabel = 'Special Overlay';

    await openOverlay(element);

    await waitForCondition(
      () => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Special Overlay`,
    );

    expect(ariaLiveRef.textContent!.trim()).to.be.equal(`${i18nDialog.en}, Special Overlay`);
  });
});
