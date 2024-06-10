import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import type { SbbSecondaryButtonElement } from '../button.js';
import { fixture } from '../core/testing/private.js';
import { EventSpy, waitForLitRender } from '../core/testing.js';

import { SbbFileSelectorElement } from './file-selector.js';
import '../button/secondary-button.js';

function addFilesToComponentInput(
  elem: SbbFileSelectorElement,
  numberOfFiles: number,
  filesContent: string | string[] = 'Hello world',
): void {
  const dataTransfer: DataTransfer = new DataTransfer();
  for (let i: number = 0; i < numberOfFiles; i++) {
    const content = filesContent instanceof Array ? filesContent[i] : filesContent;
    dataTransfer.items.add(
      new File([`${content} - ${i}`], `hello${i}.txt`, {
        type: 'text/plain',
        lastModified: new Date(i).getMilliseconds(),
      }),
    );
  }
  const input: HTMLInputElement = elem.shadowRoot!.querySelector<HTMLInputElement>('input')!;
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change'));
}

describe(`sbb-file-selector`, () => {
  let element: SbbFileSelectorElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-file-selector></sbb-file-selector>`);
  });

  it('renders', () => {
    assert.instanceOf(element, SbbFileSelectorElement);
  });

  it('loads a file, then deletes it', async () => {
    const fileChangedSpy = new EventSpy(SbbFileSelectorElement.events.fileChangedEvent);
    addFilesToComponentInput(element, 1);
    await waitForLitRender(element);

    expect(fileChangedSpy.count).to.be.equal(1);
    expect(element.files.length).to.be.greaterThan(0);

    const listItems = element.shadowRoot!.querySelector<HTMLElement>(
      '.sbb-file-selector__file-list',
    );
    expect(listItems).dom.to.be.equal(`
      <div class="sbb-file-selector__file-list">
        <span class="sbb-file-selector__file">
          <span class="sbb-file-selector__file-details">
            <span class="sbb-file-selector__file-name">hello0.txt</span>
            <span class="sbb-file-selector__file-size">15 B</span>
          </span>
          <sbb-secondary-button aria-label="Remove file - hello0.txt"
                                dir="ltr"
                                icon-name="trash-small"
                                data-action
                                data-button
                                data-sbb-button
                                role="button"
                                size="m"
                                tabindex="0">
          </sbb-secondary-button>
        </span>
      </div>
    `);

    const button: SbbSecondaryButtonElement =
      element.shadowRoot!.querySelector<SbbSecondaryButtonElement>(
        'sbb-secondary-button[icon-name="trash-small"]',
      )!;
    expect(button).not.to.be.null;
    button.click();
    await waitForLitRender(element);

    const files = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file');
    expect(fileChangedSpy.count).to.be.equal(2);
    expect(files.length).to.be.equal(0);
  });

  it('loads more than one file in multiple mode', async () => {
    const fileChangedSpy = new EventSpy(SbbFileSelectorElement.events.fileChangedEvent);
    element.multiple = true;
    await waitForLitRender(element);
    addFilesToComponentInput(element, 2);
    await waitForLitRender(element);
    expect(fileChangedSpy.count).to.be.greaterThan(0);

    const listItems = element.shadowRoot!.querySelectorAll('li');
    const filesDetails = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-details');
    const filesName = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-name');
    const filesSize = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-size');

    expect(listItems.length).to.be.equal(2);
    expect(filesDetails.length).to.be.equal(2);
    expect(filesName[0]).dom.text('hello0.txt');
    expect(filesName[1]).dom.text('hello1.txt');
    expect(filesSize[0]).dom.text('15 B');
    expect(filesSize[1]).dom.text('15 B');
  });

  it('loads files in multiple persistent mode', async () => {
    const fileChangedSpy = new EventSpy(SbbFileSelectorElement.events.fileChangedEvent);
    element.multiple = true;
    element.multipleMode = 'persistent';
    await waitForLitRender(element);
    addFilesToComponentInput(element, 1);
    await waitForLitRender(element);
    expect(fileChangedSpy.count).to.be.equal(1);

    const filesDetails = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-details');
    let filesName = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-name');
    let filesSize = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-size');

    expect(element.files).not.to.be.null;
    expect(filesName.length).to.be.equal(1);
    expect(filesDetails.length).to.be.equal(1);
    expect(filesName[0]).dom.text('hello0.txt');
    expect(filesSize[0]).dom.text('15 B');

    const longContent = 'Lorem ipsum dolor sit amet. '.repeat(100);
    addFilesToComponentInput(element, 2, ['Hello world', longContent]);

    await waitForLitRender(element);

    const files = element.shadowRoot!.querySelectorAll('li');
    filesName = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-name');
    filesSize = element.shadowRoot!.querySelectorAll('.sbb-file-selector__file-size');

    expect(fileChangedSpy.count).to.be.equal(2);
    expect(files.length).to.be.equal(2);
    expect(filesName[0]).dom.text('hello1.txt');
    expect(filesSize[0]).dom.text('3 kB');
    expect(filesName[1]).dom.text('hello0.txt');
    expect(filesSize[1]).dom.text('15 B');
  });
});
