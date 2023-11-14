import { ElementPart, Part } from 'lit';
import { Directive, directive, DirectiveResult } from 'lit/directive.js';
import { nothing } from 'lit/html.js';

type EventListenerWithOptions = EventListenerOrEventListenerObject &
  Partial<AddEventListenerOptions>;

export class SbbSpreadDirective extends Directive {
  private _host!: EventTarget | object | Element;
  private _element!: Element;
  private _prevData: { [key: string]: unknown } = {};
  private _eventData: { [key: string]: unknown } = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(_spreadData: { [key: string]: unknown }): typeof nothing {
    return nothing;
  }

  public override update(part: Part, [spreadData]: Parameters<this['render']>): void {
    if (this._element !== (part as ElementPart).element) {
      this._element = (part as ElementPart).element;
    }
    this._host = part.options?.host || this._element;
    this.apply(spreadData);
    this.groom(spreadData);
    this._prevData = { ...spreadData };
  }

  public apply(data: { [key: string]: unknown }): void {
    if (!data) {
      return;
    }
    for (const key in data) {
      const value = data[key];
      if (value === this._prevData[key]) {
        continue;
      }
      const name = key.slice(1);
      switch (key[0]) {
        case '@': // event listener
          this._eventData[name] = value;
          this.applyEvent(name, value as EventListenerWithOptions);
          break;
        case '.': // property
          this._element[name] = value;
          break;
        case '?': // boolean attribute
          if (value) {
            this._element.setAttribute(name, '');
          } else {
            this._element.removeAttribute(name);
          }
          break;
        default:
          // standard attribute
          if (value) {
            this._element.setAttribute(key, String(value));
          } else {
            this._element.removeAttribute(key);
          }
          break;
      }
    }
  }

  public groom(data: { [key: string]: unknown }): void {
    if (!this._prevData) {
      return;
    }
    for (const key in this._prevData) {
      const name = key.slice(1);
      if (!data || (!(key in data) && this._element[name] === this._prevData[key])) {
        switch (key[0]) {
          case '@': // event listener
            this.groomEvent(name, this._prevData[key] as EventListenerWithOptions);
            break;
          case '.': // property
            this._element[name] = undefined;
            break;
          case '?': // boolean attribute
            this._element.removeAttribute(name);
            break;
          default:
            // standard attribute
            this._element.removeAttribute(key);
            break;
        }
      }
    }
  }

  public applyEvent(eventName: string, eventValue: EventListenerWithOptions): void {
    this._eventData[eventName] = eventValue;
    const prevHandler = this._prevData[eventName];
    if (prevHandler) {
      this._element.removeEventListener(eventName, this, eventValue);
    }
    this._element.addEventListener(eventName, this, eventValue);
  }

  public groomEvent(eventName: string, eventValue: EventListenerWithOptions): void {
    delete this._eventData[eventName];
    this._element.removeEventListener(eventName, this, eventValue);
  }

  public handleEvent(event: Event): void {
    const value: () => unknown | EventListenerObject = this._eventData[event.type] as () =>
      | unknown
      | EventListenerObject;
    if (typeof value === 'function') {
      (value as () => unknown).call(this._host, event);
    } else {
      (value as EventListenerObject).handleEvent(event);
    }
  }

  public disconnected(): void {
    for (const key in this._eventData) {
      // event listener
      const name = key.slice(1);
      const value = this._eventData[key] as EventListenerWithOptions;
      this._element.removeEventListener(name, this, value);
    }
  }

  public reconnected(): void {
    for (const key in this._eventData) {
      // event listener
      const name = key.slice(1);
      const value = this._eventData[key] as EventListenerWithOptions;
      this._element.addEventListener(name, this, value);
    }
  }
}

export const sbbSpread: (_spreadData: {
  [p: string]: unknown;
}) => DirectiveResult<typeof SbbSpreadDirective> = directive(SbbSpreadDirective);
