import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { isArrowKeyPressed, getNextElementIndex, interactivityChecker } from '../../core/a11y';
import { hostAttributes } from '../../core/common-behaviors';
import { isBrowser } from '../../core/dom';
import { EventEmitter, ConnectedAbortController } from '../../core/eventing';
import type {
  SbbCheckedStateChange,
  SbbStateChange,
  SbbValueStateChange,
} from '../../core/interfaces';
import { AgnosticResizeObserver } from '../../core/observers';
import type { SbbToggleOptionElement } from '../toggle-option';

import style from './toggle.scss?lit&inline';

export type SbbToggleStateChange = Extract<
  SbbStateChange,
  SbbValueStateChange | SbbCheckedStateChange
>;

/**
 * It can be used as a container for two `sbb-toggle-option`, acting as a toggle button.
 *
 * @slot - Use the unnamed slot to add `<sbb-toggle-option>` elements to the toggle.
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {CustomEvent<void>} change - Emits whenever the toggle value changes.
 */
@customElement('sbb-toggle')
@hostAttributes({
  role: 'radiogroup',
})
export class SbbToggleElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    change: 'change',
  } as const;

  /**
   * Whether the toggle is disabled.
   */
  @property({ reflect: true, type: Boolean })
  public set disabled(value: boolean) {
    this._disabled = value;
    this._updateDisabled();
  }
  public get disabled(): boolean {
    return this._disabled;
  }
  private _disabled: boolean = false;

  /**
   * If true, set the width of the component fixed; if false, the width is dynamic based on the label of the sbb-toggle-option.
   */
  @property({ reflect: true, type: Boolean }) public even: boolean = false;

  /**
   * Size variant, either m or s.
   */
  @property({ reflect: true }) public size?: 's' | 'm' = 'm';

  /**
   * The value of the toggle. It needs to be mutable since it is updated whenever
   * a new option is selected (see the `onToggleOptionSelect()` method).
   */
  @property()
  public value: any | null;

  private _loaded: boolean = false;
  private _toggleElement!: HTMLElement;
  private _toggleResizeObserver = new AgnosticResizeObserver(() =>
    this._setCheckedPillPosition(true),
  );

  private _valueChanged(value: any | undefined): void {
    const options = this._options;
    // If options are not yet defined web components, we can check if attribute is already set as a fallback.
    // We do this by checking whether value property is available (defined component).
    const selectedOption =
      options.find(
        (o) => value === ('value' in o ? o.value : (o as HTMLElement).getAttribute('value')),
      ) ??
      options.find((o) => o.checked) ??
      options[0];

    if (!selectedOption) {
      isBrowser() && console.warn(`sbb-toggle: No available options! (${this.id || 'No id'})`);
      return;
    }
    if (!selectedOption.checked) {
      selectedOption.checked = true;
    }
    options.filter((o) => o !== selectedOption && o.checked).forEach((o) => (o.checked = false));
    this._setCheckedPillPosition(false);
  }

  private _updateDisabled(): void {
    for (const toggleOption of this._options) {
      toggleOption.disabled = this.disabled;
    }
  }

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   * Emits whenever the toggle value changes.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbToggleElement.events.didChange, {
    bubbles: true,
    composed: true,
  });

  /** Emits whenever the toggle value changes. */
  private _change: EventEmitter = new EventEmitter(this, SbbToggleElement.events.change, {
    bubbles: true,
    composed: true,
  });

  private get _options(): SbbToggleOptionElement[] {
    return Array.from(
      this.querySelectorAll?.('sbb-toggle-option') ?? [],
    ) as SbbToggleOptionElement[];
  }

  private _handleInput(): void {
    this._emitChange();
  }
  private _abort = new ConnectedAbortController(this);

  private _handleStateChange(event: CustomEvent<SbbToggleStateChange>): void {
    const target: SbbToggleOptionElement = event.target as SbbToggleOptionElement;
    event.stopPropagation();
    if (event.detail.type === 'value') {
      this.value = event.detail.value;
      // We emit in this case, as when the value of an option changes
      // also the value of the toggle itself changes.
      // This is an exception, as we don't normally emit on programmatic changes.
      this._emitChange();
      return;
    } else if (event.detail.type !== 'checked') {
      return;
    }

    if (event.detail.checked) {
      this.value = target.value;
    } else if (this._options.every((o) => !o.checked)) {
      // If no option is currently checked, we select the first option, as per requirement
      // there must always be a checked option. We also need to emit in order for listeners
      // to register the change.
      this.value = this._options[0].value;
      this._emitChange();
    }
  }

  private _setCheckedPillPosition(resizing: boolean): void {
    if (!this._loaded) {
      return;
    }

    const options = this._options;

    if (
      options.every((o) => !o.checked) ||
      options.every((o) => !o.clientWidth) ||
      !this._toggleElement
    ) {
      return;
    }

    this.toggleAttribute('data-disable-animation-on-resizing', resizing);

    const firstOption = options[0];
    const isFirstChecked = firstOption.checked;
    const pillLeft = firstOption.checked ? '0px' : `${firstOption.clientWidth}px`;
    const pillRight = isFirstChecked
      ? `${this._toggleElement.clientWidth - firstOption.clientWidth}px`
      : '0px';

    this.style?.setProperty('--sbb-toggle-option-left', pillLeft);
    this.style?.setProperty('--sbb-toggle-option-right', pillRight);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('input', () => this._handleInput(), { signal, passive: true });
    this.addEventListener(
      'stateChange',
      (e: CustomEvent<SbbStateChange>) =>
        this._handleStateChange(e as CustomEvent<SbbToggleStateChange>),
      {
        signal,
        passive: true,
      },
    );
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._options.forEach((option) => this._toggleResizeObserver.observe(option));
    this._updateToggle();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('value')) {
      this._valueChanged(this.value);
    }
  }

  protected override async firstUpdated(changedProperties: PropertyValues): Promise<void> {
    super.firstUpdated(changedProperties);
    await this.updateComplete;
    this._loaded = true;
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._toggleResizeObserver.disconnect();
  }

  private _updateToggle(): void {
    this._valueChanged(this.value);
    this._updateDisabled();
  }

  private _emitChange(): void {
    this._change.emit();
    this._didChange.emit();
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    const enabledToggleOptions = this._options?.filter(
      (t) => !t.disabled && interactivityChecker.isVisible(t),
    );

    if (
      !enabledToggleOptions ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this && (evt.target as HTMLElement).parentElement !== this)
    ) {
      return;
    }

    if (isArrowKeyPressed(evt)) {
      const checked: number = enabledToggleOptions.findIndex(
        (toggleOption: SbbToggleOptionElement) => toggleOption.checked,
      );
      const nextIndex: number = getNextElementIndex(evt, checked, enabledToggleOptions.length);
      if (!enabledToggleOptions[nextIndex].checked) {
        enabledToggleOptions[nextIndex].checked = true;
        enabledToggleOptions[nextIndex].focus();
        enabledToggleOptions[nextIndex].dispatchEvent(
          new InputEvent('input', { bubbles: true, composed: true }),
        );
      }
      evt.preventDefault();
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-toggle" ${ref((toggle) => (this._toggleElement = toggle as HTMLElement))}>
        <slot @slotchange=${() => this._updateToggle()}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-toggle': SbbToggleElement;
  }
}
