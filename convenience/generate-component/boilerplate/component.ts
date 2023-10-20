import { CSSResult, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ConnectedAbortController, EventEmitter } from '../../global/eventing';
import Style from './__name__.scss?lit&inline';

/**
 * @slot unnamed - Use this to document a slot.
 */
@customElement('__name__')
export class __nameUpperCase__ extends LitElement {
  public static override styles: CSSResult = Style;
  public static readonly events: Record<string, string> = {
    myEventName: 'my-event-name',
  } as const;

  /** myProp documentation */
  @property({ attribute: 'my-prop', reflect: true }) public myProp: string;

  /** _myState documentation */
  @state() private _myState = false;

  private _abort = new ConnectedAbortController(this);
  private _myEvent: EventEmitter<any> = new EventEmitter(this, __nameUpperCase__.events.myEventName);

  private _onClickFn(): void {
    this._myEvent.emit();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', () => this._onClickFn(), { signal });
    // do stuff
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
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