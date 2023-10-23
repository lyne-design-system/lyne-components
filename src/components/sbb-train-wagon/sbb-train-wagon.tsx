import { InterfaceSbbTrainWagonAttributes } from './sbb-train-wagon.custom';
import {
  i18nAdditionalWagonInformationHeading,
  i18nBlockedPassage,
  i18nClass,
  i18nClosedCompartmentLabel,
  i18nLocomotiveLabel,
  i18nOccupancy,
  i18nSector,
  i18nWagonLabel,
  i18nWagonLabelNumber,
} from '../../global/i18n';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import { CSSResult, LitElement, nothing, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { SbbIcon } from '../sbb-icon';
import { setAttribute } from '../../global/dom';
import Style from './sbb-train-wagon.scss?lit&inline';
import '../sbb-icon';

/**
 * @slot unnamed - Used to slot one to x icons for meta information of the sbb-train-wagon.
 */
@customElement('sbb-train-wagon')
export class SbbTrainWagon extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    sectorChange: 'sector-change',
  };

  /** Wagon type. */
  @property({ reflect: true }) public type: InterfaceSbbTrainWagonAttributes['type'] = 'wagon';

  /** Occupancy of a wagon. */
  @property() public occupancy?: InterfaceSbbTrainWagonAttributes['occupancy'] = 'unknown';

  /** Sector in which to wagon stops. */
  @property({ reflect: true })
  public get sector(): string {
    return this._sector;
  }
  public set sector(value: string) {
    const oldValue = this._sector;
    this._sector = value;
    this._sectorChanged();
    this.requestUpdate('sector', oldValue);
  }
  private _sector: string = null;

  /** Accessibility text for blocked passages of the wagon. */
  @property({ attribute: 'blocked-passage' })
  public blockedPassage: InterfaceSbbTrainWagonAttributes['blockedPassage'] = 'none';

  /** Visible class label of a wagon. */
  @property({ attribute: 'wagon-class' }) public wagonClass?: '1' | '2';

  /** Visible label for the wagon number. Not used by type locomotive or closed. */
  @property() public label?: string;

  /** Additional accessibility text which will be appended to the end. */
  @property({ attribute: 'additional-accessibility-text' })
  public additionalAccessibilityText?: string;

  /** Slotted Sbb-icons. */
  @state() private _icons: SbbIcon[];

  @state() private _currentLanguage = documentLanguage();

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    this._readSlottedIcons();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  /**
   * @internal
   * Emits whenever the sector value changes.
   */
  private _sectorChange: EventEmitter = new EventEmitter(this, SbbTrainWagon.events.sectorChange, {
    bubbles: true,
    cancelable: true,
  });

  private _sectorChanged(): void {
    this._sectorChange.emit();
  }

  /**
   * Create an array with only the sbb-icon children.
   */
  private _readSlottedIcons(): void {
    this._icons = Array.from(this.children).filter((e): e is SbbIcon => e.tagName === 'SBB-ICON');
  }

  protected override render(): TemplateResult {
    // We should avoid lists with only one entry
    if (this._icons?.length > 1) {
      this._icons.forEach((icon, index) =>
        icon.setAttribute('slot', `sbb-train-wagon-icon-${index}`),
      );
    } else {
      this._icons?.forEach((icon) => icon.removeAttribute('slot'));
    }

    const label = (tagName: string): TemplateResult => {
      const TAG_NAME = tagName;
      /* eslint-disable lit/binding-positions */
      return html`
        <${unsafeStatic(TAG_NAME)} class="sbb-train-wagon__label" aria-hidden=${(!this
          .label).toString()}>
          ${
            this.label
              ? html` <span class="sbb-screenreaderonly">
                    ${`${i18nWagonLabelNumber[this._currentLanguage]},`}&nbsp;
                  </span>
                  ${this.label}`
              : nothing
          }
        </${unsafeStatic(TAG_NAME)}>
      `;
      /* eslint-disable lit/binding-positions */
    };

    const sectorString = `${i18nSector[this._currentLanguage]}, ${this.sector}`;

    setAttribute(
      this,
      'data-has-visible-wagon-content',
      Boolean((this.type === 'wagon' && this.occupancy) || this.wagonClass),
    );

    return html`
      <div class="sbb-train-wagon">
        ${this.type === 'wagon'
          ? html`<ul
              aria-label=${i18nWagonLabel[this._currentLanguage]}
              class="sbb-train-wagon__compartment"
            >
              ${this.sector ? html`<li class="sbb-screenreaderonly">${sectorString}</li>` : nothing}
              ${label('li')}
              ${this.wagonClass
                ? html`<li class="sbb-train-wagon__class">
                    <span class="sbb-screenreaderonly">
                      ${this.wagonClass === '1'
                        ? i18nClass['first'][this._currentLanguage]
                        : i18nClass['second'][this._currentLanguage]}
                    </span>
                    <span aria-hidden="true">${this.wagonClass}</span>
                  </li>`
                : nothing}
              ${this.occupancy
                ? html`<sbb-icon
                    class="sbb-train-wagon__occupancy"
                    role="listitem"
                    name=${`utilization-${this.occupancy === 'unknown' ? 'none' : this.occupancy}`}
                    aria-hidden="false"
                    aria-label=${i18nOccupancy[this.occupancy][this._currentLanguage]}
                  ></sbb-icon>`
                : nothing}
              ${this.blockedPassage && this.blockedPassage !== 'none'
                ? html`<li class="sbb-screenreaderonly">
                    ${i18nBlockedPassage[this.blockedPassage][this._currentLanguage]}
                  </li>`
                : nothing}
            </ul>`
          : nothing}
        ${this.type === 'closed'
          ? html`<span class="sbb-train-wagon__compartment">
              <span class="sbb-screenreaderonly">
                ${i18nClosedCompartmentLabel(parseInt(this.label))[this._currentLanguage]}
                ${this.sector ? `, ${sectorString}` : nothing}
              </span>
              ${label('span')}
            </span>`
          : nothing}
        ${this.type === 'locomotive'
          ? html`<span class="sbb-train-wagon__compartment">
              <span class="sbb-screenreaderonly">
                ${i18nLocomotiveLabel[this._currentLanguage]}
                ${this.sector ? `, ${sectorString}` : nothing}
              </span>
              ${label('span')}
              <svg
                class="sbb-train-wagon__locomotive"
                aria-hidden="true"
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.7906 4.42719C19.9743 1.93152 23.129 0.5 26.4452 0.5H53.5548C56.871 0.5 60.0257 1.93152 62.2094 4.4272L76.2094 20.4272C82.7157 27.8629 77.4351 39.5 67.5548 39.5H12.4452C2.56489 39.5 -2.71566 27.8629 3.79058 20.4272L17.7906 4.42719Z"
                  stroke="var(--sbb-train-wagon-shape-color-closed)"
                />
              </svg>
            </span>`
          : nothing}
        ${this.additionalAccessibilityText
          ? html`<span class="sbb-screenreaderonly">, ${this.additionalAccessibilityText}</span>`
          : nothing}
        ${this.type === 'wagon'
          ? html`<span
              class="sbb-train-wagon__icons"
              ?hidden=${!this._icons || this._icons?.length === 0}
            >
              ${this._icons?.length > 1
                ? html`<ul
                    class="sbb-train-wagon__icons-list"
                    aria-label=${i18nAdditionalWagonInformationHeading[this._currentLanguage]}
                  >
                    ${this._icons.map(
                      (_, index) =>
                        html`<li class="sbb-train-wagon__icons-item">
                          <slot
                            name=${`sbb-train-wagon-icon-${index}`}
                            @slotchange=${(): void => this._readSlottedIcons()}
                          ></slot>
                        </li>`,
                    )}
                  </ul>`
                : nothing}
              <span class="sbb-train-wagon__icons-item" ?hidden=${this._icons?.length !== 1}>
                ${this._icons?.length === 1
                  ? html`<span class="sbb-screenreaderonly">
                      ${i18nAdditionalWagonInformationHeading[this._currentLanguage]}
                    </span>`
                  : nothing}
                <slot @slotchange=${(): void => this._readSlottedIcons()}></slot>
              </span>
            </span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-train-wagon': SbbTrainWagon;
  }
}
