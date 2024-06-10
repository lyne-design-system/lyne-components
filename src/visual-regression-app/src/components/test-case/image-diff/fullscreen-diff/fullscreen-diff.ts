import { LitElement, html, type TemplateResult, type CSSResultGroup, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { ScreenshotFiles } from '../../../../interfaces.js';

import style from './fullscreen-diff.scss?lit&inline';

import '@sbb-esta/lyne-elements/chip.js';
import '@sbb-esta/lyne-elements/radio-button.js';
import type { SbbRadioButtonGroupElement } from '@sbb-esta/lyne-elements/radio-button/radio-button-group/radio-button-group.js';

/**
 * Displays two images in fullscreen to overlay them.
 */
@customElement('app-fullscreen-diff')
export class FullscreenDiff extends LitElement {
  public static override styles: CSSResultGroup = style;

  @property() public screenshotFiles?: ScreenshotFiles;

  @property() public selectedFile: 'baselineFile' | 'failedFile' | 'diffFile' = 'failedFile';

  public override render(): TemplateResult {
    if (!this.screenshotFiles) {
      return html``;
    }
    return html`<div class="app-labels">
        <sbb-chip size="xxs" color="white">${this.screenshotFiles.browserName}</sbb-chip>
        <sbb-chip size="xxs" color="white">${this.screenshotFiles.viewport}</sbb-chip>
      </div>
      <sbb-radio-button-group
        class="app-radio-button-group"
        value=${this.selectedFile}
        @change=${(event: Event) =>
          (this.selectedFile = (event.target as SbbRadioButtonGroupElement).value)}
      >
        ${!this.screenshotFiles.isNew
          ? html`<sbb-radio-button value="baselineFile">Baseline</sbb-radio-button>`
          : nothing}
        ${this.screenshotFiles.failedFile
          ? html`<sbb-radio-button value="failedFile">
              ${this.screenshotFiles.isNew ? 'New' : 'Failed'}
            </sbb-radio-button>`
          : nothing}
        ${this.screenshotFiles.diffFile
          ? html`<sbb-radio-button value="diffFile">Diff</sbb-radio-button>`
          : nothing}
      </sbb-radio-button-group>
      <div class="app-scroll-container">
        <img class="app-image" .src="./${this.screenshotFiles?.[this.selectedFile]}" alt="" />
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'app-fullscreen-diff': FullscreenDiff;
  }
}
