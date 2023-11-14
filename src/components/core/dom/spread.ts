import { ElementPart, Part } from 'lit';
import { Directive, directive, DirectiveResult } from 'lit/directive.js';
import { nothing } from 'lit/html.js';

import { setAttributes } from './is-valid-attribute';

export class SbbSpreadDirective extends Directive {
  private _element!: Element;
  private _prevData: Record<string, any> = {};

  public render(): typeof nothing {
    return nothing;
  }

  public override update(part: Part, [spreadData]: { [key: string]: unknown }[]): void {
    if (this._element !== (part as ElementPart).element) {
      this._element = (part as ElementPart).element;
    }
    this.apply(spreadData);
    this.groom(spreadData);
    this._prevData = { ...spreadData };
  }

  public apply(data: Record<string, any>): void {
    setAttributes(this._element as HTMLElement, data);
  }

  public groom(data: Record<string, any>): void {
    if (!this._prevData) {
      return;
    }
    for (const key of Object.keys(this._prevData)) {
      if (!data || (!(key in data) && this._element[key] === this._prevData[key])) {
        this._element.removeAttribute(key);
      }
    }
  }
}

export const sbbSpread: (_spreadData: {
  [p: string]: unknown;
}) => DirectiveResult<typeof SbbSpreadDirective> = directive(SbbSpreadDirective);
