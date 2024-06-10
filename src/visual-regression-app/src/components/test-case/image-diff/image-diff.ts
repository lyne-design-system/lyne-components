import { LitElement, html, type TemplateResult, type CSSResultGroup, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { ScreenshotFiles } from '../../../interfaces.js';

import style from './image-diff.scss?lit&inline';

import { SbbOverlayElement } from '@sbb-esta/lyne-elements/overlay/overlay.js';
import type { SbbToggleCheckElement } from '@sbb-esta/lyne-elements/toggle-check/toggle-check.js';

import '@sbb-esta/lyne-elements/chip.js';
import '@sbb-esta/lyne-elements/status.js';
import '@sbb-esta/lyne-elements/overlay.js';
import '@sbb-esta/lyne-elements/toggle-check.js';

import './fullscreen-diff/fullscreen-diff.js';

const getImageDimension = (img: HTMLImageElement): string =>
  `${img.naturalWidth}x${img.naturalHeight}px`;

/**
 * Displays two images to compare them.
 */
@customElement('app-image-diff')
export class ImageDiff extends LitElement {
  public static override styles: CSSResultGroup = style;

  @property() public screenshotFiles?: ScreenshotFiles;

  @state() private _baselineDimension?: string;
  @state() private _failedDimension?: string;

  @state() private _showDiff: boolean = true;

  private _toggleDiff(event: Event): void {
    this._showDiff = (event.target as SbbToggleCheckElement).checked;
  }

  private _setFailedImageDimension(event: Event): void {
    this._failedDimension = getImageDimension(event.target as HTMLImageElement);
  }

  private _setBaselineImageDimension(event: Event): void {
    this._baselineDimension = getImageDimension(event.target as HTMLImageElement);
  }

  /**
   * To avoid blown up DOM, we create the overlay only when it's needed.
   */
  private _showFullscreen(selectedFile: 'baselineFile' | 'failedFile' | 'diffFile'): void {
    const sbbOverlayElement: SbbOverlayElement = document.createElement('sbb-overlay');
    const appFullscreenDiff = document.createElement('app-fullscreen-diff');

    sbbOverlayElement.expanded = true;
    appFullscreenDiff.selectedFile = selectedFile;
    appFullscreenDiff.screenshotFiles = this.screenshotFiles;

    sbbOverlayElement.appendChild(appFullscreenDiff);
    document.body.appendChild(sbbOverlayElement);
    sbbOverlayElement.addEventListener(SbbOverlayElement.events.didClose, () => {
      document.body.removeChild(sbbOverlayElement);
    });

    sbbOverlayElement.open();
  }

  public override render(): TemplateResult {
    if (!this.screenshotFiles) {
      return html``;
    }
    return html`<div class="app-container">
      <div class="app-info-bar">
        <div class="app-labels">
          <sbb-chip size="xxs" color="white">${this.screenshotFiles.browserName}</sbb-chip>
          <sbb-chip size="xxs" color="white">${this.screenshotFiles.viewport}</sbb-chip>
          ${this._baselineDimension
            ? html`<sbb-chip size="xxs" color="white">
                Baseline: ${this._baselineDimension}
              </sbb-chip>`
            : nothing}
          ${this._failedDimension
            ? html`<sbb-chip size="xxs" color="white">
                ${this.screenshotFiles.isNew ? 'New' : 'Failed'}: ${this._failedDimension}
              </sbb-chip>`
            : nothing}
        </div>
        ${!this.screenshotFiles.isNew && this.screenshotFiles.diffFile
          ? html`<sbb-toggle-check
              checked
              size="s"
              class="app-diff-toggle"
              @change=${this._toggleDiff}
            >
              Show Diff
            </sbb-toggle-check>`
          : nothing}
      </div>
      <div class="app-image-container">
        <div class="app-image-baseline">
          ${!this.screenshotFiles.isNew
            ? html`<button
                @click=${() => this._showFullscreen('baselineFile')}
                class="app-image-button"
              >
                <img
                  class="app-image"
                  .src="./${this.screenshotFiles?.baselineFile}"
                  alt=""
                  @load=${this._setBaselineImageDimension}
                />
              </button>`
            : html`<sbb-status type="info" class="app-new-test-case-info">
                New test case
              </sbb-status>`}
        </div>
        ${this.screenshotFiles.failedFile
          ? html`<div class="app-image-failed">
              <button
                @click=${() => this._showFullscreen('diffFile')}
                class="app-image-button"
                ?hidden=${!this._showDiff || this.screenshotFiles.isNew}
              >
                <img class="app-image" .src="./${this.screenshotFiles?.diffFile}" alt="" />
              </button>
              <button
                @click=${() => this._showFullscreen('failedFile')}
                class="app-image-button"
                ?hidden=${this._showDiff && !this.screenshotFiles.isNew}
              >
                <img
                  class="app-image"
                  .src="./${this.screenshotFiles?.failedFile}"
                  alt=""
                  @load=${this._setFailedImageDimension}
                />
              </button>
            </div>`
          : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'app-image-diff': ImageDiff;
  }
}
