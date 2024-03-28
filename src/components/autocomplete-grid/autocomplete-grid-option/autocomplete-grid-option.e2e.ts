import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForLitRender } from '../../core/testing';
import { fixture } from '../../core/testing/private';
import type { SbbFormFieldElement } from '../../form-field';
import type { SbbAutocompleteGridElement } from '../autocomplete-grid';
import type { SbbAutocompleteGridOptgroupElement } from '../autocomplete-grid-optgroup';

import { SbbAutocompleteGridOptionElement } from './autocomplete-grid-option';

describe(`sbb-autocomplete-grid-option with ${fixture.name}`, () => {
  let element: SbbFormFieldElement;

  beforeEach(async () => {
    element = await fixture(
      html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete-grid>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option>Option 1</sbb-autocomplete-grid-option>
              <sbb-autocomplete-grid-actions>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-actions>
            </sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option>Option 2</sbb-autocomplete-grid-option>
              <sbb-autocomplete-grid-actions>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-actions>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
        </sbb-form-field>
      `,
      { modules: ['../../autocomplete-grid/index.ts', '../../form-field/index.ts'] },
    );
  });

  it('renders', async () => {
    const option = element.querySelector('sbb-autocomplete-grid-option')!;
    assert.instanceOf(option, SbbAutocompleteGridOptionElement);
  });

  it('set selected and emits on click', async () => {
    const selectionChangeSpy = new EventSpy(
      SbbAutocompleteGridOptionElement.events.selectionChange,
    );
    const optionOne = element.querySelector<SbbAutocompleteGridOptionElement>(
      'sbb-autocomplete-grid-option',
    )!;

    optionOne.dispatchEvent(new CustomEvent('click'));
    await waitForLitRender(element);

    expect(optionOne.selected).to.be.equal(true);
    expect(selectionChangeSpy.count).to.be.equal(1);
  });

  it('highlight on input', async () => {
    const input = element.querySelector<HTMLInputElement>('input')!;
    const autocomplete =
      element.querySelector<SbbAutocompleteGridElement>('sbb-autocomplete-grid')!;
    const options = element.querySelectorAll('sbb-autocomplete-grid-option');
    const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');
    const optionTwoLabel = options[1].shadowRoot!.querySelector('.sbb-option__label');

    input.focus();
    await sendKeys({ press: '1' });
    await waitForLitRender(autocomplete);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight">Option</span>
        <span>1</span>
        <span class="sbb-option__label--highlight"></span>
      </span>
    `);
    expect(optionTwoLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        Option 2
      </span>
    `);
  });

  it('highlight after option label changed', async () => {
    const input = element.querySelector<HTMLInputElement>('input')!;
    const autocomplete =
      element.querySelector<SbbAutocompleteGridElement>('sbb-autocomplete-grid')!;
    const options = element.querySelectorAll('sbb-autocomplete-grid-option');
    const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

    input.focus();
    await sendKeys({ type: 'Opt' });
    await waitForLitRender(autocomplete);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion 1</span>
      </span>
    `);

    options[0].textContent = 'Other content';
    await waitForLitRender(autocomplete);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        Other content
      </span>
    `);

    options[0].textContent = 'Option';
    await waitForLitRender(autocomplete);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion</span>
      </span>
    `);
  });

  it('highlight later added options', async () => {
    const input = element.querySelector<HTMLInputElement>('input')!;
    const autocomplete =
      element.querySelector<SbbAutocompleteGridElement>('sbb-autocomplete-grid')!;
    const options = element.querySelectorAll('sbb-autocomplete-grid-option');
    const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

    input.focus();
    await sendKeys({ type: 'Opt' });
    await waitForLitRender(autocomplete);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion 1</span>
      </span>
    `);

    const newOption = document.createElement('sbb-autocomplete-grid-option');
    newOption.innerText = 'Option 3';
    autocomplete.append(newOption);
    await waitForLitRender(autocomplete);

    const newOptionLabel = newOption.shadowRoot!.querySelector('.sbb-option__label');

    expect(newOptionLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion 3</span>
      </span>
    `);
  });

  it('highlight later added options in sbb-optgroup', async () => {
    element = await fixture(
      html`
        <sbb-form-field>
          <input />
          <sbb-autocomplete-grid>
            <sbb-autocomplete-grid-optgroup>
              <sbb-autocomplete-grid-row>
                <sbb-autocomplete-grid-option>Option 1</sbb-autocomplete-grid-option>
                <sbb-autocomplete-grid-actions>
                  <sbb-autocomplete-grid-button
                    icon-name="pie-small"
                  ></sbb-autocomplete-grid-button>
                </sbb-autocomplete-grid-actions>
              </sbb-autocomplete-grid-row>
            </sbb-autocomplete-grid-optgroup>
          </sbb-autocomplete-grid>
        </sbb-form-field>
      `,
      {
        modules: ['../../form-field/index.ts', '../../autocomplete-grid/index.ts'],
      },
    );

    const input = element.querySelector<HTMLInputElement>('input')!;
    const optgroup = element.querySelector<SbbAutocompleteGridOptgroupElement>(
      'sbb-autocomplete-grid-optgroup',
    )!;
    const options = element.querySelectorAll('sbb-autocomplete-grid-option');
    const optionOneLabel = options[0].shadowRoot!.querySelector('.sbb-option__label');

    input.focus();
    await sendKeys({ type: 'Opt' });
    await waitForLitRender(element);

    expect(optionOneLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion 1</span>
      </span>
    `);

    const newOption = document.createElement('sbb-autocomplete-grid-option');
    newOption.innerText = 'Option 2';
    optgroup.append(newOption);
    await waitForLitRender(element);

    const newOptionLabel = newOption.shadowRoot!.querySelector('.sbb-option__label');

    expect(newOptionLabel).dom.to.be.equal(`
      <span class="sbb-option__label">
        <slot></slot>
        <span class="sbb-option__label--highlight"></span>
        <span>Opt</span>
        <span class="sbb-option__label--highlight">ion 2</span>
      </span>
    `);
  });
});
