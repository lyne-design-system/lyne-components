import icons from '../core/timetable/icons.json';
import { i18nBarrierFreeTravel } from '../core/i18n';
import { documentLanguage, HandlerRepository, languageChangeHandlerAspect } from '../core/eventing';
import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import style from './timetable-barrier-free.scss?lit&inline';

/**
 * Used in `sbb-timetable-row`, it displays information about barriers for screen-readers.
 */
@customElement('sbb-timetable-barrier-free')
export class SbbTimetableBarrierFree extends LitElement {
  public static override styles: CSSResult = style;

  /**
   * Stringified JSON which defines most of the
   * content of the component. Please check the
   * individual stories to get an idea of the
   * structure.
   */
  @property() public config!: string;

  @state() private _currentLanguage = documentLanguage();

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  protected override render(): TemplateResult {
    const config = JSON.parse(this.config);

    const a11yLabel = `${i18nBarrierFreeTravel[this._currentLanguage]} ${config.text}`;
    const appearanceClass = ' barrier-free--second-level';

    return html`
      <p aria-label=${a11yLabel} class=${`barrier-free${appearanceClass}`} role="text">
        <span class="barrier-free__text--visually-hidden">${a11yLabel}</span>
        <span aria-hidden="true" class="barrier-free__text" role="presentation">
          <span class="barrier-free__icon" .innerHTML=${icons[config.icon]}></span>
          ${config.text}
        </span>
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-timetable-barrier-free': SbbTimetableBarrierFree;
  }
}
