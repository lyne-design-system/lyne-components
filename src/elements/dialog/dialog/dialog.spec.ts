import { assert, expect, fixture } from '@open-wc/testing';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { i18nDialog } from '../../core/i18n.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';

import { SbbDialogElement } from './dialog.js';
import '../../button.js';
import '../../icon.js';
import '../dialog-title.js';
import '../dialog-content.js';
import '../dialog-actions.js';

async function openDialog(element: SbbDialogElement): Promise<void> {
  const willOpen = new EventSpy(SbbDialogElement.events.willOpen);
  const didOpen = new EventSpy(SbbDialogElement.events.didOpen);

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

describe('sbb-dialog', () => {
  let element: SbbDialogElement, ariaLiveRef: HTMLElement;

  beforeEach(async () => {
    await setViewport({ width: 900, height: 600 });
    element = await fixture(html`
      <sbb-dialog id="my-dialog-1">
        <sbb-dialog-title>Title</sbb-dialog-title>
        <sbb-dialog-content>Dialog content</sbb-dialog-content>
        <sbb-dialog-actions>Action group</sbb-dialog-actions>
      </sbb-dialog>
    `);
    ariaLiveRef = element.shadowRoot!.querySelector('sbb-screen-reader-only')!;
  });

  it('renders', () => {
    assert.instanceOf(element, SbbDialogElement);
  });

  it('opens the dialog', async () => {
    await openDialog(element);
  });

  it('does not open the dialog if prevented', async () => {
    const willOpen = new EventSpy(SbbDialogElement.events.willOpen);
    const didOpen = new EventSpy(SbbDialogElement.events.didOpen);

    element.addEventListener(SbbDialogElement.events.willOpen, (ev) => ev.preventDefault());

    element.open();
    await waitForLitRender(element);

    await waitForCondition(() => willOpen.events.length === 1);
    expect(willOpen.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(didOpen.count).to.be.equal(0);
    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('closes the dialog', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Title`);

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

  it('does not close the dialog if prevented', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    element.addEventListener(SbbDialogElement.events.willClose, (ev) => ev.preventDefault());

    element.close();
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(didClose.count).to.be.equal(0);
    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('closes the dialog on backdrop click', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    // Simulate backdrop click
    element.dispatchEvent(new CustomEvent('pointerdown'));
    element.dispatchEvent(new CustomEvent('pointerup'));
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('does not close the dialog on backdrop click', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    element.backdropAction = 'none';
    await waitForLitRender(element);

    await openDialog(element);

    // Simulate backdrop click
    element.dispatchEvent(new CustomEvent('pointerdown'));
    element.dispatchEvent(new CustomEvent('pointerup'));
    await waitForLitRender(element);

    expect(willClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(didClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('does not close the dialog on backdrop click if pointerdown is on dialog', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    // Simulate backdrop click
    element
      .shadowRoot!.querySelector('.sbb-dialog')!
      .dispatchEvent(new CustomEvent('pointerdown', { bubbles: true, composed: true }));
    element.dispatchEvent(new CustomEvent('pointerup'));
    await waitForLitRender(element);

    expect(willClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(didClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('does not close the dialog on backdrop click if pointerup is on dialog', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    // Simulate backdrop click
    element.dispatchEvent(new CustomEvent('pointerdown'));
    element
      .shadowRoot!.querySelector('.sbb-dialog')!
      .dispatchEvent(new CustomEvent('pointerup', { bubbles: true, composed: true }));
    await waitForLitRender(element);

    expect(willClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(didClose.count).to.be.equal(0);
    await waitForLitRender(element);

    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('closes the dialog on close button click', async () => {
    const closeButton = element
      .querySelector('sbb-dialog-title')!
      .shadowRoot!.querySelector('[sbb-dialog-close]') as HTMLElement;
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

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

  it('closes the dialog on Esc key press', async () => {
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

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

  it('closes stacked dialogs one by one on ESC key pressed', async () => {
    element = await fixture(html`
      <sbb-dialog id="my-dialog-3">
        <sbb-dialog-title>Title</sbb-dialog-title>
        <sbb-dialog-content>Dialog content</sbb-dialog-content>
        <sbb-dialog-actions>Action group</sbb-dialog-actions>
      </sbb-dialog>

      <sbb-dialog id="stacked-dialog">
        <sbb-dialog-title>Stacked title</sbb-dialog-title>
        <sbb-dialog-content>Dialog content</sbb-dialog-content>
        <sbb-dialog-actions>Action group</sbb-dialog-actions>
      </sbb-dialog>
    `);

    const willOpen = new EventSpy(SbbDialogElement.events.willOpen);
    const didOpen = new EventSpy(SbbDialogElement.events.didOpen);
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);

    await openDialog(element);

    const stackedDialog = document.querySelector('#stacked-dialog') as SbbDialogElement;

    stackedDialog.open();
    await waitForLitRender(element);

    await waitForCondition(() => willOpen.events.length === 2);
    expect(willOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    await waitForCondition(() => didOpen.events.length === 2);
    expect(didOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    expect(stackedDialog).to.have.attribute('data-state', 'opened');

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

    expect(stackedDialog).to.have.attribute('data-state', 'closed');
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

    expect(stackedDialog).to.have.attribute('data-state', 'closed');
    expect(element).to.have.attribute('data-state', 'closed');
  });

  it('does not close the dialog on other overlay click', async () => {
    await setViewport({ width: 900, height: 600 });
    element = await fixture(html`
      <sbb-dialog id="my-dialog-4">
        <sbb-dialog-title>Title</sbb-dialog-title>
        <sbb-dialog-content>Dialog content</sbb-dialog-content>

        <sbb-dialog id="inner-dialog">
          <sbb-dialog-title>Inner Dialog title</sbb-dialog-title>
          <sbb-dialog-content>Dialog content</sbb-dialog-content>
        </sbb-dialog>
      </sbb-dialog>
    `);
    const willOpen = new EventSpy(SbbDialogElement.events.willOpen);
    const didOpen = new EventSpy(SbbDialogElement.events.didOpen);
    const willClose = new EventSpy(SbbDialogElement.events.willClose);
    const didClose = new EventSpy(SbbDialogElement.events.didClose);
    const innerElement = element.querySelector('sbb-dialog') as SbbDialogElement;

    await openDialog(element);

    innerElement.open();
    await waitForLitRender(element);

    await waitForCondition(() => willOpen.events.length === 2);
    expect(willOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    await waitForCondition(() => didOpen.events.length === 2);
    expect(didOpen.count).to.be.equal(2);
    await waitForLitRender(element);

    expect(innerElement).to.have.attribute('data-state', 'opened');

    // Simulate a click on the inner dialog's backdrop
    innerElement.dispatchEvent(new CustomEvent('pointerdown'));
    innerElement.dispatchEvent(new CustomEvent('pointerup'));
    await waitForLitRender(element);

    await waitForCondition(() => willClose.events.length === 1);
    expect(willClose.count).to.be.equal(1);
    await waitForLitRender(element);

    await waitForCondition(() => didClose.events.length === 1);
    expect(didClose.count).to.be.equal(1);
    await waitForLitRender(element);

    expect(innerElement).to.have.attribute('data-state', 'closed');
    expect(element).to.have.attribute('data-state', 'opened');
  });

  it('should remove ariaLiveRef content on any keyboard interaction', async () => {
    await openDialog(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Title`);

    await sendKeys({ down: 'Tab' });
    await waitForLitRender(element);

    expect(ariaLiveRef.textContent!.trim()).to.be.equal('');
  });

  it('should remove ariaLiveRef content on any click interaction', async () => {
    await openDialog(element);

    await waitForCondition(() => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Title`);

    element.click();
    await waitForLitRender(element);

    expect(ariaLiveRef.textContent).to.be.equal('');
  });

  it('should announce accessibility label in ariaLiveRef if explicitly set', async () => {
    element.accessibilityLabel = 'Special Dialog';

    await openDialog(element);

    await waitForCondition(
      () => ariaLiveRef.textContent!.trim() === `${i18nDialog.en}, Special Dialog`,
    );

    expect(ariaLiveRef.textContent!.trim()).to.be.equal(`${i18nDialog.en}, Special Dialog`);
  });
});

describe('sbb-dialog with long content', () => {
  let element: SbbDialogElement;

  beforeEach(async () => {
    await setViewport({ width: 900, height: 300 });
    element = await fixture(html`
      <sbb-dialog id="my-dialog-1">
        <sbb-dialog-title hide-on-scroll="">Title</sbb-dialog-title>
        <sbb-dialog-content>
          Frodo halted for a moment, looking back. Elrond was in his chair and the fire was on his
          face like summer-light upon the trees. Near him sat the Lady Arwen. To his surprise Frodo
          saw that Aragorn stood beside her; his dark cloak was thrown back, and he seemed to be
          clad in elven-mail, and a star shone on his breast. They spoke together, and then suddenly
          it seemed to Frodo that Arwen turned towards him, and the light of her eyes fell on him
          from afar and pierced his heart. He stood still enchanted, while the sweet syllables of
          the elvish song fell like clear jewels of blended word and melody. 'It is a song to
          Elbereth,'' said Bilbo. 'They will sing that, and other songs of the Blessed Realm, many
          times tonight. Come on!’ —J.R.R. Tolkien, The Lord of the Rings: The Fellowship of the
          Ring, “Many Meetings” J.R.R. Tolkien, the mastermind behind Middle-earth's enchanting
          world, was born on January 3, 1892. With "The Hobbit" and "The Lord of the Rings", he
          pioneered fantasy literature. Tolkien's linguistic brilliance and mythic passion converge
          in a literary legacy that continues to transport readers to magical realms.
        </sbb-dialog-content>
        <sbb-dialog-actions>Action group</sbb-dialog-actions>
      </sbb-dialog>
    `);
  });

  it('renders', () => {
    assert.instanceOf(element, SbbDialogElement);
  });

  it('sets the data-overflows attribute', async () => {
    await openDialog(element);

    expect(element).to.have.attribute('data-state', 'opened');
    expect(element).to.have.attribute('data-overflows', '');
  });

  it('shows/hides the dialog header on scroll', async () => {
    await openDialog(element);
    expect(element).not.to.have.attribute('data-hide-header');

    const content = element.querySelector('sbb-dialog-content')!.shadowRoot!.firstElementChild!;

    // Scroll down.
    content.scrollTo(0, 50);
    await waitForCondition(() => element.hasAttribute('data-hide-header'));

    expect(element).to.have.attribute('data-hide-header');

    // Scroll up.
    content.scrollTo(0, 0);
    await waitForCondition(() => !element.hasAttribute('data-hide-header'));

    expect(element).not.to.have.attribute('data-hide-header');
  });
});
