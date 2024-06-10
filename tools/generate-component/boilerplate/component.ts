import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { SbbConnectedAbortController } from '../core/controllers.js';
import { EventEmitter } from '../core/eventing.js';

import style from './__noPrefixName__.scss?lit&inline';

/**
 * Describe the purpose of the component with a single short sentence.
 *
 * @slot - Use the unnamed slot to add `sbb-TODO` elements.
 * @event {CustomEvent<any>} myEventName - TODO: Document this event
 */
@customElement('__name__')
export class __nameUpperCase__ extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events: Record<string, string> = {
    myEventName: 'myEventName',
  } as const;

  /** myProp documentation */
  @property({ attribute: 'my-prop', reflect: true }) public myProp: string = '';

  /** _myState documentation */
  @state() private _myState = false;

  private _abort = new SbbConnectedAbortController(this);
  private _myEvent: EventEmitter<any> = new EventEmitter(
    this,
    __nameUpperCase__.events.myEventName,
  );

  private _onClickFn(): void {
    this._myEvent.emit();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', () => this._onClickFn(), { signal });
    // do stuff
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('myProp')) {
      // do stuff
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    // do stuff
  }

  protected override render(): TemplateResult {
    return html`
      <div class="__name__">${this._myState ? html`<slot></slot>` : nothing} ${this.myProp}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '__name__': __nameUpperCase__;
  }
}
