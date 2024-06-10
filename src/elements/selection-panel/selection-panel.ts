import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { SbbCheckboxElement } from '../checkbox.js';
import { SbbConnectedAbortController, SbbSlotStateController } from '../core/controllers.js';
import { EventEmitter } from '../core/eventing.js';
import type { SbbOpenedClosedState, SbbStateChange } from '../core/interfaces.js';
import type { SbbRadioButtonElement } from '../radio-button.js';

import style from './selection-panel.scss?lit&inline';

import '../divider.js';

/**
 * It displays an expandable panel connected to a `sbb-checkbox` or to a `sbb-radio-button`.
 *
 * @slot - Use the unnamed slot to add `sbb-checkbox` or `sbb-radio-button` elements to the `sbb-selection-panel`.
 * @slot badge - Use this slot to provide a `sbb-card-badge` (optional).
 * @slot content - Use this slot to provide custom content for the panel (optional).
 * @event {CustomEvent<void>} willOpen - Emits whenever the content section starts the opening transition.
 * @event {CustomEvent<void>} didOpen - Emits whenever the content section is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the content section begins the closing transition.
 * @event {CustomEvent<void>} didClose - Emits whenever the content section is closed.
 */
@customElement('sbb-selection-panel')
export class SbbSelectionPanelElement extends LitElement {
  // FIXME inheriting from SbbOpenCloseBaseElement requires: https://github.com/open-wc/custom-elements-manifest/issues/253
  public static override styles: CSSResultGroup = style;
  public static readonly events: Record<string, string> = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** The background color of the panel. */
  @property() public color: 'white' | 'milk' = 'white';

  /** Whether the content section is always visible. */
  @property({ attribute: 'force-open', type: Boolean }) public forceOpen = false;

  /** Whether the unselected panel has a border. */
  @property({ reflect: true, type: Boolean }) public borderless = false;

  /** The state of the selection panel. */
  @state()
  private set _state(state: SbbOpenedClosedState) {
    this.setAttribute('data-state', state);
  }
  private get _state(): SbbOpenedClosedState {
    return this.getAttribute('data-state') as SbbOpenedClosedState;
  }

  /** Whether the selection panel is checked. */
  private set _checked(checked: boolean) {
    this.toggleAttribute('data-checked', checked);
  }
  private get _checked(): boolean {
    return this.hasAttribute('data-checked');
  }

  /** Whether the selection panel is disabled. */
  private set _disabled(disabled: boolean) {
    this.toggleAttribute('data-disabled', disabled);
  }

  /** Emits whenever the content section starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbSelectionPanelElement.events.willOpen,
  );

  /** Emits whenever the content section is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbSelectionPanelElement.events.didOpen,
  );

  /** Emits whenever the content section begins the closing transition. */
  private _willClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbSelectionPanelElement.events.willClose,
  );

  /** Emits whenever the content section is closed. */
  private _didClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbSelectionPanelElement.events.didClose,
  );

  private _abort = new SbbConnectedAbortController(this);
  private _initialized: boolean = false;

  /**
   * Whether it has an expandable content
   * @internal
   */
  public get hasContent(): boolean {
    // We cannot use the NamedSlots because it's too slow to initialize
    return this.querySelectorAll?.('[slot="content"]').length > 0;
  }

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._state ||= 'closed';
    const signal = this._abort.signal;
    this.addEventListener('stateChange', this._onInputStateChange.bind(this), { signal });
    this.addEventListener('checkboxLoaded', this._initFromInput.bind(this), { signal });
    this.addEventListener('radioButtonLoaded', this._initFromInput.bind(this), { signal });
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('forceOpen')) {
      this._updateState();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this._initialized = true;
  }

  private _updateState(): void {
    if (!this.hasContent) {
      return;
    }

    this.forceOpen || this._checked ? this._open(!this._initialized) : this._close();
  }

  private _open(skipAnimation = false): void {
    if (this._state !== 'closed' && this._state !== 'closing') {
      return;
    }

    this._state = 'opening';
    this._willOpen.emit();

    if (skipAnimation) {
      this._state = 'opened';
      this._didOpen.emit();
    }
  }

  private _close(): void {
    if (this._state !== 'opened' && this._state !== 'opening') {
      return;
    }

    this._state = 'closing';
    this._willClose.emit();
  }

  private _initFromInput(event: Event): void {
    const input = event.target as SbbCheckboxElement | SbbRadioButtonElement;

    if (!input.isSelectionPanelInput) {
      return;
    }

    this._checked = input.checked;
    this._disabled = input.disabled;
    this._updateState();
  }

  private _onInputStateChange(event: CustomEvent<SbbStateChange>): void {
    const input = event.target as SbbCheckboxElement | SbbRadioButtonElement;

    if (!input.isSelectionPanelInput) {
      return;
    }

    if (event.detail.type === 'disabled') {
      this._disabled = event.detail.disabled;
      return;
    } else if (event.detail.type !== 'checked') {
      return;
    }

    this._checked = event.detail.checked;
    this._updateState();
  }

  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open-opacity' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._didClose.emit();
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-selection-panel">
        <div class="sbb-selection-panel__badge">
          <slot name="badge"></slot>
        </div>

        <div class="sbb-selection-panel__input">
          <slot></slot>
        </div>
        <div
          class="sbb-selection-panel__content--wrapper"
          .inert=${this._state !== 'opened'}
          @animationend=${(event: AnimationEvent) => this._onAnimationEnd(event)}
        >
          <div class="sbb-selection-panel__content">
            <sbb-divider></sbb-divider>
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-selection-panel': SbbSelectionPanelElement;
  }
}
