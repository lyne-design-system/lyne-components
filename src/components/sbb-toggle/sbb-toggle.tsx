import { InterfaceSbbToggleAttributes } from './sbb-toggle.custom';
import { ToggleOptionStateChange } from '../sbb-toggle-option/sbb-toggle-option.custom';
import { isArrowKeyPressed, getNextElementIndex, interactivityChecker } from '../../global/a11y';
import { toggleDatasetEntry } from '../../global/dom';
import { AgnosticResizeObserver } from '../../global/observers';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EventEmitter, ConnectedAbortController } from '../../global/eventing';
import { SbbToggleOption } from '../sbb-toggle-option';
import { setAttribute } from '../../global/dom';
import { ref } from 'lit/directives/ref.js';
import Style from './sbb-toggle.scss?lit&inline';

/**
 * @slot unnamed - Slot used to render the `<sbb-toggle-option>`.
 */
@customElement('sbb-toggle')
export class SbbToggle extends LitElement {
  public static override styles = Style;

  public static readonly events = {
    didChange: 'did-change',
    change: 'change',
  };

  /**
   * Whether the toggle is disabled.
   */
  @property({ reflect: true, type: Boolean })
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    const oldValue = this._disabled;
    this._disabled = value;
    this._updateDisabled();
    this.requestUpdate('disabled', oldValue);
  }
  private _disabled: boolean = false;

  /**
   * If true, set the width of the component fixed; if false, the width is dynamic based on the label of the sbb-toggle-option.
   */
  @property({ reflect: true, type: Boolean }) public even: boolean;

  /**
   * Size variant, either m or s.
   */
  @property({ reflect: true }) public size?: InterfaceSbbToggleAttributes['size'] = 'm';

  /**
   * The value of the toggle. It needs to be mutable since it is updated whenever
   * a new option is selected (see the `onToggleOptionSelect()` method).
   */
  @property()
  public value: any | null;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  private _toggleElement: HTMLElement;
  private _toggleResizeObserver = new AgnosticResizeObserver(() =>
    this._setCheckedPillPosition(true),
  );

  private _valueChanged(value: any | undefined): void {
    const selectedOption =
      this._options.find((o) => o.value === value) ??
      this._options.find((o) => o.checked) ??
      this._options[0];
    if (!selectedOption) {
      console.warn(`sbb-toggle: No available options! (${this.id || 'No id'})`);
      return;
    }
    if (!selectedOption.checked) {
      selectedOption.checked = true;
    }
    this._options
      .filter((o) => o !== selectedOption && o.checked)
      .forEach((o) => (o.checked = false));
    this._setCheckedPillPosition(false);
  }

  private _updateDisabled(): void {
    for (const toggleOption of this._options) {
      toggleOption.disabled = this.disabled;
    }
  }

  /**
   * Emits whenever the radio group value changes.
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */

  private _didChange: EventEmitter = new EventEmitter(this, SbbToggle.events.didChange, {
    bubbles: true,
    composed: true,
  });

  /**
   * Emits whenever the radio group value changes.
   */

  private _change: EventEmitter = new EventEmitter(this, SbbToggle.events.change, {
    bubbles: true,
    composed: true,
  });

  private get _options(): SbbToggleOption[] {
    return Array.from(this.querySelectorAll('sbb-toggle-option')) as SbbToggleOption[];
  }

  private _handleInput(): void {
    this._emitChange();
  }
  private _abort = new ConnectedAbortController(this);

  private _handleStateChange(event: CustomEvent<ToggleOptionStateChange>): void {
    const target: SbbToggleOption = event.target as SbbToggleOption;
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
    const options = this._options;

    if (options.every((o) => !o.checked) || !this._toggleElement) {
      return;
    }

    toggleDatasetEntry(this, 'disableAnimationOnResizing', resizing);

    const firstOption = options[0];
    const isFirstChecked = firstOption.checked;
    const pillLeft = firstOption.checked ? '0px' : `${firstOption.clientWidth}px`;
    const pillRight = isFirstChecked
      ? `${this._toggleElement.clientWidth - firstOption.clientWidth}px`
      : '0px';

    this.style.setProperty('--sbb-toggle-option-left', pillLeft);
    this.style.setProperty('--sbb-toggle-option-right', pillRight);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('input', () => this._handleInput(), { signal, passive: true });
    this.addEventListener(
      'state-change',
      (e) => this._handleStateChange(e as CustomEvent<ToggleOptionStateChange>),
      {
        signal,
        passive: true,
      },
    );
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._options.forEach((option) => this._toggleResizeObserver.observe(option));
    this._updateToggle();
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('value')) {
      this._valueChanged(this.value);
    }
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
        (toggleOption: SbbToggleOption) => toggleOption.checked,
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
    setAttribute(this, 'role', 'radiogroup');
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
    'sbb-toggle': SbbToggle;
  }
}
