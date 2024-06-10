import type { DirectiveResult } from 'lit/directive.js';
import { Directive, directive } from 'lit/directive.js';
import type { ElementPart, Part } from 'lit/html.js';
import { nothing } from 'lit/html.js';

export class SbbSpreadDirective extends Directive {
  private _element!: Element;
  private _prevData: Record<string, any> = {};

  public render(): typeof nothing {
    return nothing;
  }

  public override update(part: Part, [spreadData]: { [key: string]: unknown }[]): void {
    super.update(part, [spreadData]);
    if (this._element !== (part as ElementPart).element) {
      this._element = (part as ElementPart).element;
    }
    this.apply(spreadData);
    this.groom(spreadData);
    this._prevData = { ...spreadData };
  }

  public apply(data: Record<string, any>): void {
    if (!data) {
      return;
    }

    for (const [name, value] of Object.entries(data)) {
      if (typeof value === 'boolean' || !value) {
        this._element.toggleAttribute(name, !!value);
      } else {
        this._element.setAttribute(name, value);
      }
    }
  }

  public groom(data: Record<string, any>): void {
    if (!this._prevData) {
      return;
    }
    for (const key of Object.keys(this._prevData)) {
      if (
        !data ||
        (!(key in data) && this._element[key as keyof Element] === this._prevData[key])
      ) {
        this._element.removeAttribute(key);
      }
    }
  }
}

export const sbbSpread: (_spreadData: {
  [p: string]: unknown;
}) => DirectiveResult<typeof SbbSpreadDirective> = directive(SbbSpreadDirective);
