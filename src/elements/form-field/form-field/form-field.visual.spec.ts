import { html, nothing, type TemplateResult } from 'lit';

import {
  describeEach,
  describeViewports,
  visualDiffActive,
  visualDiffDefault,
  visualDiffFocus,
} from '../../core/testing/private.js';

import './form-field.js';
import '../../button/mini-button.js';
import '../../form-error.js';
import '../../popover.js';

describe(`sbb-form-field`, () => {
  const formField = (
    {
      'error-space': errorSpace,
      label,
      optional,
      size,
      borderless,
      width,
      negative,
      'hidden-label': hiddenLabel,
      'floating-label': floatingLabel,
      slottedLabel,
      errorText,
    }: { [key: string]: unknown },
    template: TemplateResult,
  ): TemplateResult =>
    html`<sbb-form-field
      error-space=${errorSpace}
      ?optional=${optional}
      size=${size}
      ?borderless=${borderless}
      width=${width}
      ?hidden-label=${hiddenLabel}
      ?floating-label=${floatingLabel}
      ?negative=${negative}
    >
      ${label && !slottedLabel
        ? html`<label>${label}</label>`
        : label && slottedLabel
          ? html`<span slot="label">${label}</span>`
          : nothing}
      ${template}
      ${errorText
        ? html`<sbb-form-error slot="error">This is a required field.</sbb-form-error>`
        : nothing}
    </sbb-form-field>`;

  const basicInput = ({
    cssClass,
    placeholder,
    disabled,
    readonly,
    value,
  }: any): TemplateResult => html`
    <input
      class=${cssClass}
      placeholder=${placeholder}
      ?disabled=${disabled}
      ?readonly=${readonly}
      value=${value}
    />
  `;

  const basicSelect = ({ cssClass, disabled, selectNullValue }: any): TemplateResult => html`
    <select class=${cssClass} ?disabled=${disabled}>
      ${selectNullValue ? html`<option value="0" selected></option>` : nothing}
      <option value="1">Value 1</option>
      <option value="2">Value 2</option>
      <option value="3">Value 3</option>
    </select>
  `;

  const basicTextarea = ({
    cssClass,
    placeholder,
    disabled,
    readonly,
    value,
  }: any): TemplateResult =>
    html`<textarea
      class=${cssClass}
      placeholder=${placeholder}
      ?disabled=${disabled}
      ?readonly=${readonly}
    >
${value}</textarea
    >`;

  const icons: TemplateResult = html`
    <sbb-icon slot="prefix" name="pie-small"></sbb-icon>
    <sbb-icon slot="suffix" name="dog-small"></sbb-icon>
  `;

  const buttonsAndPopover = ({ disabled, readonly }: any): TemplateResult => html`
    <sbb-mini-button
      slot="prefix"
      icon-name="pie-small"
      ?disabled=${disabled || readonly}
      aria-label="Input button"
    ></sbb-mini-button>
    <sbb-popover-trigger
      slot="suffix"
      id="popover-trigger"
      icon-name="circle-information-small"
    ></sbb-popover-trigger>
    <sbb-popover trigger="popover-trigger"> Some content. </sbb-popover>
  `;

  const basicArgs = {
    'error-space': 'none',
    label: 'Input name',
    'hidden-label': false,
    'floating-label': false,
    optional: false,
    borderless: false,
    size: 'm',
    negative: false,
    cssClass: '',
    placeholder: 'Input placeholder',
    value: 'Input value',
    disabled: false,
    readonly: false,
    errorText: false,
    width: 'default',
    active: false,
    selectNullValue: false,
  };

  const states = {
    negative: [false, true],
    state: [
      { disabled: true, readonly: false },
      { disabled: false, readonly: true },
    ],
  };

  const visualProp = {
    negative: [false, true],
    optional: [true, false],
    borderless: [true, false],
    size: ['m', 'l'],
    width: ['default', 'collapse'],
    errorText: [true, false],
  };

  const component = new Map()
    .set('input', basicInput)
    .set('select', basicSelect)
    .set('textarea', basicTextarea);

  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    // visual states
    for (const [name, template] of component.entries()) {
      for (const visualDiffState of [visualDiffDefault, visualDiffFocus, visualDiffActive]) {
        it(
          `slot=none ${name} ${visualDiffState.name}`,
          visualDiffState.with(async (setup) => {
            await setup.withFixture(html`${formField(basicArgs, template(basicArgs))}`);
          }),
        );

        it(
          `slot=icons ${name} ${visualDiffState.name}`,
          visualDiffState.with(async (setup) => {
            const templateResult: TemplateResult = html`${template(basicArgs)} ${icons}`;
            await setup.withFixture(html` ${formField(basicArgs, templateResult)} `);
          }),
        );

        it(
          `slot=buttons ${name} ${visualDiffState.name}`,
          visualDiffState.with(async (setup) => {
            const templateResult: TemplateResult = html`${template(basicArgs)}
            ${buttonsAndPopover(basicArgs)}`;
            await setup.withFixture(html` ${formField(basicArgs, templateResult)} `);
          }),
        );
      }
    }

    // disabled and readonly states
    describeEach(states, ({ negative, state }) => {
      const args = {
        ...basicArgs,
        negative,
        disabled: state.disabled,
        readonly: state.readonly,
      };

      for (const [name, template] of component.entries()) {
        it(
          `text ${name} ${visualDiffDefault.name}`,
          visualDiffDefault.with(async (setup) => {
            await setup.withFixture(html`${formField(args, template(args))}`);
          }),
        );

        it(
          `icons ${name} ${visualDiffDefault.name}`,
          visualDiffDefault.with(async (setup) => {
            const templateResult: TemplateResult = html`${template(args)} ${icons}`;
            await setup.withFixture(html` ${formField(args, templateResult)} `);
          }),
        );

        it(
          `buttons ${name} ${visualDiffDefault.name}`,
          visualDiffDefault.with(async (setup) => {
            const templateResult: TemplateResult = html`${template(args)} ${buttonsAndPopover(args)}`;
            await setup.withFixture(html` ${formField(args, templateResult)} `);
          }),
        );
      }
    });

    // labels
    for (const [name, template] of component.entries()) {
      it(
        `label=undefined ${name} ${visualDiffDefault.name}`,
        visualDiffDefault.with(async (setup) => {
          const noLabel = { ...basicArgs, label: undefined };
          await setup.withFixture(html`${formField(noLabel, template(noLabel))}`);
        }),
      );

      it(
        `label=hidden ${name} ${visualDiffDefault.name}`,
        visualDiffDefault.with(async (setup) => {
          const hiddenLabel = { ...basicArgs, 'hidden-label': true };
          await setup.withFixture(html`${formField(hiddenLabel, template(hiddenLabel))}`);
        }),
      );

      it(
        `label=slotted ${name} ${visualDiffDefault.name}`,
        visualDiffDefault.with(async (setup) => {
          const slottedLabel = { ...basicArgs, 'slotted-label': true };
          await setup.withFixture(html`${formField(slottedLabel, template(slottedLabel))}`);
        }),
      );

      it(
        `label=floating ${name} ${visualDiffDefault.name}`,
        visualDiffDefault.with(async (setup) => {
          const hiddenLabel = {
            ...basicArgs,
            'floating-label': true,
            value: undefined,
            selectNullValue: true,
          };
          await setup.withFixture(html`${formField(hiddenLabel, template(hiddenLabel))}`);
        }),
      );

      it(
        `label=ellipsis ${name} ${visualDiffDefault.name}`,
        visualDiffDefault.with(async (setup) => {
          const hiddenLabel = {
            ...basicArgs,
            label: 'This label name is so long that it needs ellipsis to fit',
          };
          await setup.withFixture(html`${formField(hiddenLabel, template(hiddenLabel))}`);
        }),
      );
    }

    // visual
    describeEach(visualProp, ({ negative, optional, borderless, size, width, errorText }) => {
      for (const [name, template] of component.entries()) {
        it(
          `${name} ${visualDiffDefault.name}`,
          visualDiffDefault.with(async (setup) => {
            const args = {
              ...basicArgs,
              negative,
              optional,
              borderless,
              size,
              width,
              errorText,
              cssClass: errorText ? 'sbb-invalid' : '',
            };
            await setup.withFixture(html`${formField(args, template(args))}`);
          }),
        );
      }
    });
  });
});
