import type { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';

import { sbbSpread } from '../../../storybook/helpers/spread.js';
import '../../button.js';

/* eslint-disable lit/binding-positions */
export const buttonTestTemplate = (tag: string, isStatic = false): TemplateResult => {
  const attributes: Record<string, string> = isStatic
    ? {}
    : { type: 'button', name: 'name', value: 'value', form: 'formid' };
  return html`
    <${unsafeStatic(tag)} ${sbbSpread(attributes)} negative disabled size='m'>
      Label Text
    </${unsafeStatic(tag)}>
  `;
};

export const buttonSlottedIconTestTemplate = (tag: string): TemplateResult => {
  return html`
    <${unsafeStatic(tag)}>
      <sbb-icon slot="icon" name="chevron-small-left-small"></sbb-icon>
      Label Text
    </${unsafeStatic(tag)}>
  `;
};

export const buttonIconTestTemplate = (tag: string): TemplateResult => {
  return html`
    <${unsafeStatic(tag)}><sbb-icon slot="icon" name="app-icon-medium"></sbb-icon></${unsafeStatic(tag)}>
  `;
};

export const buttonSpaceIconTestTemplate = (tag: string): TemplateResult => {
  return html`
    <${unsafeStatic(tag)}> <sbb-icon slot="icon" name="app-icon-medium"> </sbb-icon> </${unsafeStatic(tag)}>
  `;
};

export const buttonLinkTestTemplate = (tag: string): TemplateResult => {
  return html`
    <${unsafeStatic(tag)} size="m" href="https://www.sbb.ch" target="_blank" rel="noopener" download>
      Label Text
    </${unsafeStatic(tag)}>
  `;
};

export const buttonLinkIconTestTemplate = (tag: string): TemplateResult => {
  return html`
    <${unsafeStatic(tag)} href="https://www.sbb.ch" disabled>
      <sbb-icon slot="icon" name="chevron-small-left-small"></sbb-icon>
      Label Text
    </${unsafeStatic(tag)}>
  `;
};
/* eslint-enable lit/binding-positions */
