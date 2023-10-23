import { InterfaceSbbTrainAttributes } from './sbb-train.custom';
import { i18nTrain, i18nWagonsLabel } from '../../global/i18n';
import { TitleLevel } from '../sbb-title';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import { CSSResult, LitElement, nothing, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { SbbTrainBlockedPassage } from '../sbb-train-blocked-passage';
import { SbbTrainWagon } from '../sbb-train-wagon';
import Style from './sbb-train.scss?lit&inline';
import '../sbb-icon';

/**
 * @slot unnamed - Used for slotting sbb-train-wagons.
 */
@customElement('sbb-train')
export class SbbTrain extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    trainSlotChange: 'train-slot-change',
  };

  /** General label for "driving direction". */
  @property({ attribute: 'direction-label' }) public directionLabel!: string;

  /** Heading level of the direction label, used for screen readers. */
  @property({ attribute: 'direction-label-level' }) public directionLabelLevel: TitleLevel = '6';

  /** Label for the destination station of the train. */
  @property() public station?: string;

  /** Accessibility label for additional information regarding the leaving direction of the train. */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel?: string;

  /** Controls the direction indicator to show the arrow left or right. Default is left.  */
  @property({ reflect: true }) public direction: InterfaceSbbTrainAttributes['direction'] = 'left';

  @state() private _wagons: (SbbTrainBlockedPassage | SbbTrainWagon)[];

  @state() private _currentLanguage = documentLanguage();

  /**
   * @internal
   * Emits whenever the train slot changes.
   */
  private _trainSlotChange: EventEmitter = new EventEmitter(this, SbbTrain.events.trainSlotChange, {
    bubbles: true,
    cancelable: true,
  });

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    this._readWagons();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  /**
   * Create the aria-label text out of the direction label, station and the accessibility label.
   */
  private _getDirectionAriaLabel(): string {
    const textParts: string[] = [i18nTrain[this._currentLanguage]];

    if (this.directionLabel && this.station) {
      textParts.push(`${this.directionLabel} ${this.station}`);
    }

    if (this.accessibilityLabel) {
      textParts.push(this.accessibilityLabel);
    }

    return `${textParts.join(', ')}.`;
  }

  private _readWagons(): void {
    const wagons = Array.from(this.children).filter(
      (e): e is SbbTrainBlockedPassage | SbbTrainWagon =>
        e.tagName === 'SBB-TRAIN-WAGON' || e.tagName === 'SBB-TRAIN-BLOCKED-PASSAGE',
    );
    // If the slotted sbb-train-wagon and sbb-train-blocked-passage instances have not changed, we can skip syncing and updating
    // the link reference list.
    if (
      this._wagons &&
      wagons.length === this._wagons.length &&
      this._wagons.every((e, i) => wagons[i] === e)
    ) {
      return;
    }

    this._wagons = wagons;
  }

  private _handleSlotChange(): void {
    this._trainSlotChange.emit();
    this._readWagons();
  }

  protected override render(): TemplateResult {
    const TITLE_TAG_NAME = `h${this.directionLabelLevel}`;
    this._wagons.forEach((wagon, index) => wagon.setAttribute('slot', `wagon-${index}`));

    /* eslint-disable lit/binding-positions */
    return html`
      <div class="sbb-train">
        <${unsafeStatic(TITLE_TAG_NAME)} class="sbb-train__direction-label-sr">
          ${this._getDirectionAriaLabel()}
        </${unsafeStatic(TITLE_TAG_NAME)}>
        <ul class="sbb-train__wagons" aria-label=${i18nWagonsLabel[this._currentLanguage]}>
          ${this._wagons.map(
            (_, index) =>
              html`<li>
                <slot
                  name=${`wagon-${index}`}
                  @slotchange=${(): void => this._handleSlotChange()}
                ></slot>
              </li>`,
          )}
        </ul>
        <span hidden>
          <slot @slotchange=${() => this._handleSlotChange()}></slot>
        </span>

        ${
          this.directionLabel
            ? html`<div class="sbb-train__direction" aria-hidden="true">
                <div class="sbb-train__direction-heading">
                  <span class="sbb-train__direction-label">${this.directionLabel}</span>
                  ${this.station
                    ? html`<span class="sbb-train__direction-station">${this.station}</span>`
                    : nothing}
                </div>
                <div class="sbb-train__direction-indicator">
                  <div class="sbb-train__sticky-wrapper">
                    <sbb-icon
                      class="sbb-train__direction-arrow"
                      name=${this.direction === 'left'
                        ? 'chevron-small-left-small'
                        : 'chevron-small-right-small'}
                    ></sbb-icon>
                  </div>
                </div>
              </div>`
            : nothing
        }
      </div>
    `;
    /* eslint-disable lit/binding-positions */
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-train': SbbTrain;
  }
}
