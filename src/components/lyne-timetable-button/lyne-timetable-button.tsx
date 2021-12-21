import {
  Component,
  Element,
  h,
  Prop,
  Watch
} from '@stencil/core';
import chevronIcon from 'lyne-icons/dist/icons/chevron-small-right-small.svg';
import events from './lyne-timetable-button.events';
import getDocumentLang from '../../global/helpers/get-document-lang';
import getDocumentWritingMode from '../../global/helpers/get-document-writing-mode';
import { InterfaceLyneTimetableButtonAttributes } from './lyne-timetable-button.custom.d';
import {
  i18nEarlierConnections,
  i18nLaterConnections,
  i18nShowOnMap
} from '../../global/i18n';

/**
 * @slot cus-him - Use this to document a slot.
 */

@Component({
  shadow: true,
  styleUrls: {
    default: 'styles/lyne-timetable-button.default.scss',
    shared: 'styles/lyne-timetable-button.shared.scss'
  },
  tag: 'lyne-timetable-button'
})

export class LyneTimetableButton {

  private _button!: HTMLElement;
  private _currentLanguage = getDocumentLang();
  private _ctaText!: string;

  /**
   * appearance of the Timetable Button,
   * can either be used on level 1 or
   * level 2 of the timetable
   */
  @Prop() public appearance?: InterfaceLyneTimetableButtonAttributes['appearance'] = 'earlier-connections';

  /**
   * If appearance is set to cus-him or
   * walk, we need to pass on a config
   * to popultate the nested web component.
   */
  @Prop() public config?: string;

  /** Id which is sent in the click event payload */
  @Prop() public eventId?: string;

  /**
   * Set to true to initially show the
   * state, which would get set by pressing
   * the button.
   */
  @Prop({
    reflect: true
  }) public expanded?: boolean;

  /** The name attribute to use for the button */
  @Prop() public name?: string;

  /** The reference to the button */
  @Element() private _element: HTMLElement;

  @Watch('expanded')
  public watchStateHandler(newValue: boolean): void {
    this.expanded = newValue;
    this._toggleAriaAttributes(false);
  }

  private _toggleAriaAttributes(click): void {

    if (
      this.appearance === 'cus-him' ||
      this.appearance === 'walk'
    ) {

      if (click) {
        this.expanded = !this.expanded;
      }

      const expand = String(this.expanded);

      this._button.setAttribute('aria-expanded', expand);
      this._button.setAttribute('aria-haspopup', 'true');
    }

    // this._button.setAttribute('aria-pressed', expand);

  }

  private _clickHandler = (): void => {

    this._toggleAriaAttributes(true);

    let eventDetail;

    if (this.eventId) {
      eventDetail = this.eventId;
    }

    const event = new CustomEvent(events.click, {
      bubbles: true,
      composed: true,
      detail: eventDetail
    });

    this._element.dispatchEvent(event);
  };

  private _prepareButtonTextAndAttributes = (): void => {

    switch (this.appearance) {
      case 'earlier-connections':
        this._ctaText = `${i18nEarlierConnections[this._currentLanguage]}`;
        break;
      case 'later-connections':
        this._ctaText = `${i18nLaterConnections[this._currentLanguage]}`;
        break;
      case 'cus-him':
        this._ctaText = 'CUS/HIM';
        break;
      case 'walk':
        this._ctaText = `${i18nShowOnMap[this._currentLanguage]}`;
        break;
      default:
        this._ctaText = `${i18nEarlierConnections[this._currentLanguage]}`;
        break;
    }

  };

  private _renderAppearance(): JSX.Element {

    if (
      this.appearance === 'earlier-connections' ||
      this.appearance === 'later-connections'
    ) {
      return (
        <div class='button__inner_wrapper'>
          {this._ctaText}
        </div>
      );
    }

    if (this.appearance === 'cus-him') {
      return (
        <div class='button__inner_wrapper'>
          <lyne-timetable-cus-him
            appearance='second-level-button'
            config={JSON.stringify(this.config)}
          >
          </lyne-timetable-cus-him>
          <span
            class='button__chevron'
            innerHTML={chevronIcon}
          />
        </div>
      );
    }

    return (
      <div class='button__inner_wrapper'>
        <lyne-timetable-transportation-walk
          appearance='second-level'
          config={JSON.stringify(this.config)}
        >
        </lyne-timetable-transportation-walk>
        <span class='button__cta'>
          {this._ctaText}
        </span>
        <span
          class='button__chevron'
          innerHTML={chevronIcon}
        />
      </div>
    );

  }

  public render(): JSX.Element {

    const appearanceClass = ` button--${this.appearance}`;
    const currentWritingMode = getDocumentWritingMode();

    this._prepareButtonTextAndAttributes();

    return (
      <button
        aria-expanded='false'
        class={`button${appearanceClass}`}
        dir={currentWritingMode}
        onClick={this._clickHandler}
        ref={(el): void => {
          this._button = el;
        }}
        type='button'
      >
        {
          this._renderAppearance()
        }
      </button>

    );
  }

  public componentDidRender(): void {
    this._toggleAriaAttributes(false);
  }

}

