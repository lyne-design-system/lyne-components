import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { InterfaceSbbToggleAttributes } from './sbb-toggle.custom';
import { AgnosticResizeObserver as ResizeObserver } from '../../global/helpers/resize-observer';
import { getNextElementIndex, isArrowKeyPressed } from '../../global/helpers/arrow-navigation';

let nextId = 0;

/**
 * @slot unnamed - Slot used to render the `<sbb-toggle-option>`.
 */

@Component({
  shadow: true,
  styleUrl: 'sbb-toggle.scss',
  tag: 'sbb-toggle',
})
export class SbbToggle implements ComponentInterface {
  /**
   * Id of the toggle element.
   */
  @Prop() public sbbToggleId = `sbb-toggle-${++nextId}`;

  /**
   * Whether the toggle is disabled.
   */
  @Prop({ reflect: true }) public disabled = false;

  /**
   * If true set the width of the component fixed; if false the width is dynamic based on the label of the sbb-toggle-option.
   */
  @Prop({ reflect: true }) public even: boolean;

  /**
   * Size variant, either m or s.
   */
  @Prop({ reflect: true }) public size?: InterfaceSbbToggleAttributes['size'] = 'm';

  /**
   * The value of the toggle.
   */
  @Prop({ mutable: true }) public value: any | null;

  /**
   * Whether the list has an active action.
   */
  @State() private _hasCheckedOption = false;

  /**
   * Whether the animation is enabled.
   */
  @Prop({ reflect: true, mutable: true }) public disableAnimation = false;

  @Element() private _element: HTMLElement;

  private _toggleElement: HTMLElement;
  private _toggleResizeObserver = new ResizeObserver(() => this._setCheckedPillPosition(true));

  @Watch('value')
  public valueChanged(value: any | undefined): void {
    for (const toggleOption of this._options) {
      toggleOption.checked = toggleOption.value === value;
    }
    this._setCheckedPillPosition(false);
    this.change.emit({ value });
    this.didChange.emit({ value });
  }

  @Watch('disabled')
  public updateDisabled(): void {
    for (const toggleOption of this._options) {
      toggleOption.disabled = toggleOption.disabled ? toggleOption.disabled : this.disabled;
    }
  }

  /**
   * Emits whenever the radio group value changes.
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public didChange: EventEmitter;

  /**
   * Emits whenever the radio group value changes.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public change: EventEmitter;

  private get _options(): HTMLSbbToggleOptionElement[] {
    return Array.from(
      this._element.querySelectorAll('sbb-toggle-option')
    ) as HTMLSbbToggleOptionElement[];
  }

  private get _checked(): HTMLSbbToggleOptionElement {
    return this._options.find((toggle) => toggle.checked) ?? this._options[0];
  }

  @Listen('did-select', { passive: true })
  public onToggleOptionSelect(event: CustomEvent): void {
    this.value = event.detail;
  }

  private _setCheckedPillPosition(disableAnimation: boolean): void {
    const checked = this._checked;

    if (!checked) {
      return;
    }

    if (!disableAnimation) {
      this._element.removeAttribute('disable-animation');
    }

    this.disableAnimation = disableAnimation;
    this._hasCheckedOption = true;
    this._element.style.setProperty('--sbb-toggle-option-left', `${checked?.offsetLeft}px`);
    this._element.style.setProperty(
      '--sbb-toggle-option-right',
      `${this._toggleElement.clientWidth - (checked?.offsetLeft + checked?.clientWidth)}px`
    );
  }

  public connectedCallback(): void {
    this._toggleResizeObserver.observe(this._element);
  }

  public disconnectedCallback(): void {
    this._toggleResizeObserver.disconnect();
  }

  private _updateToggle(): void {
    const options = this._options;
    const value = this.value ?? this._checked?.value;

    for (const toggleOption of options) {
      toggleOption.checked = toggleOption.value === value;
      toggleOption.disabled = toggleOption.disabled ? toggleOption.disabled : this.disabled;
    }
  }

  @Listen('keydown')
  public handleKeyDown(evt: KeyboardEvent): void {
    const enabledToggleOptions = this._options?.filter((t) => !t.disabled);

    if (
      !enabledToggleOptions ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this._element &&
        (evt.target as HTMLElement).parentElement !== this._element)
    ) {
      return;
    }

    if (isArrowKeyPressed(evt)) {
      const checked: number = enabledToggleOptions.findIndex(
        (toggleOption: HTMLSbbToggleOptionElement) => toggleOption.checked
      );
      const current: number = checked !== -1 ? checked : 0;
      const nextIndex: number = getNextElementIndex(evt, current, enabledToggleOptions.length);
      enabledToggleOptions[nextIndex].select();
      enabledToggleOptions[nextIndex].focus();
      evt.preventDefault();
    }
  }

  public render(): JSX.Element {
    return (
      <Host class={{ 'sbb-toggle--checked': this._hasCheckedOption }}>
        <div
          class="sbb-toggle"
          tabIndex={this.disabled ? -1 : 0}
          ref={(toggle) => (this._toggleElement = toggle)}
        >
          <slot onSlotchange={() => this._updateToggle()} />
        </div>
      </Host>
    );
  }
}
