import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbLanguageController } from '../core/controllers.js';
import { getDocumentWritingMode } from '../core/dom.js';
import { i18nConnectionFrom, i18nConnectionRoundtrip, i18nConnectionTo } from '../core/i18n.js';
import { SbbNegativeMixin } from '../core/mixins.js';
import type { SbbTitleLevel } from '../title.js';

import style from './journey-header.scss?lit&inline';

import '../icon.js';
import '../screen-reader-only.js';
import '../title.js';

export type JourneyHeaderSize = 's' | 'm' | 'l';

const sizeToLevel: Map<JourneyHeaderSize, string> = new Map<JourneyHeaderSize, string>([
  ['s', '6'],
  ['m', '5'],
  ['l', '4'],
]);

/**
 * Combined with the `sbb-journey-summary`, it displays the journey's detail.
 */
@customElement('sbb-journey-header')
export class SbbJourneyHeaderElement extends SbbNegativeMixin(LitElement) {
  public static override styles: CSSResultGroup = style;

  /** Origin location for the journey header. */
  @property() public origin!: string;

  /** Destination location for the journey header. */
  @property() public destination!: string;

  /** Whether the journey is a round trip. If so, the icon changes to a round-trip one. */
  @property({ attribute: 'round-trip', type: Boolean }) public roundTrip?: boolean;

  /** Heading level of the journey header element (e.g. h1-h6). */
  @property() public level: SbbTitleLevel = '3';

  /** Journey header size. */
  @property({ reflect: true }) public size: JourneyHeaderSize = 'm';

  private _language = new SbbLanguageController(this);

  protected override render(): TemplateResult {
    const iconName = this.roundTrip ? 'arrows-long-right-left-small' : 'arrow-long-right-small';

    return html`
      <sbb-title
        level=${this.level || nothing}
        ?negative=${this.negative}
        visual-level=${sizeToLevel.get(this.size)!}
      >
        <span class="sbb-journey-header" dir=${getDocumentWritingMode()}>
          <span class="sbb-journey-header__origin">
            <sbb-screen-reader-only>
              ${i18nConnectionFrom[this._language.current]}&nbsp;
            </sbb-screen-reader-only>
            ${this.origin}
          </span>
          <sbb-icon name=${iconName}></sbb-icon>
          <span class="sbb-journey-header__destination">
            <sbb-screen-reader-only>
              &nbsp;${i18nConnectionTo[this._language.current]}&nbsp;
            </sbb-screen-reader-only>
            ${this.destination}
            ${this.roundTrip
              ? html` <sbb-screen-reader-only>
                  ${i18nConnectionRoundtrip(this.origin)[this._language.current]}
                </sbb-screen-reader-only>`
              : nothing}
          </span>
        </span>
      </sbb-title>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-journey-header': SbbJourneyHeaderElement;
  }
}
