import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { setAttribute } from '../core/dom';
import { ConnectedAbortController, EventEmitter } from '../core/eventing';

import style from './dialog-content.scss?lit&inline';

/**
 * Describe the purpose of the component with a single short sentence.
 *
 * @slot - Use the unnamed slot to add `sbb-TODO` elements.
 * @event {CustomEvent<any>} myEventName - TODO: Document this event
 */
@customElement('sbb-dialog-content')
export class SbbDialogContentElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events: Record<string, string> = {
    myEventName: 'myEventName',
  } as const;

  private _abort = new ConnectedAbortController(this);
  private _myEvent: EventEmitter<any> = new EventEmitter(
    this,
    SbbDialogContentElement.events.myEventName,
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

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    // do stuff
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'slot', 'content');

    return html`
      <div class="sbb-dialog__content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog-content': SbbDialogContentElement;
  }
}
