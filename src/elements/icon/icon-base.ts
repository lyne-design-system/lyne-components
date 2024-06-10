import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { DirectiveResult } from 'lit/directive.js';
import type { UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { until } from 'lit/directives/until.js';

import { hostAttributes } from '../core/decorators.js';

import { getSvgContent } from './icon-request.js';
import style from './icon.scss?lit&inline';

/**
 * @cssprop [--sbb-icon-svg-width=auto] - Can be used to set a custom width.
 * @cssprop [--sbb-icon-svg-height=auto] - Can be used to set a custom height.
 */
@hostAttributes({
  'data-namespace': SbbIconBase._defaultNamespace,
  'data-empty': '',
})
export abstract class SbbIconBase extends LitElement {
  public static override styles: CSSResultGroup = style;
  private static readonly _defaultNamespace = 'default';

  @state() private _svgNamespace = SbbIconBase._defaultNamespace;

  /**
   * The icon svg content rendered on the page: <svg>...</svg>.
   */
  @state() private _svgIcon?: Promise<DirectiveResult<typeof UnsafeHTMLDirective>>;

  /**
   * When set to `true`, SVG content that is HTTP fetched will not be checked
   * if the response SVG content has any `<script>` elements, or any attributes
   * that start with `on`, such as `onclick`.
   * @default false
   */
  @property({ attribute: 'no-sanitize', type: Boolean }) public noSanitize = false;

  protected async loadSvgIcon(iconName: string): Promise<void> {
    if (!iconName) {
      return;
    }

    const [namespace, name] = this._splitIconName(iconName);
    this._svgNamespace = namespace;
    this.setAttribute('data-namespace', this._svgNamespace);

    const svgIcon = this.fetchSvgIcon(this._svgNamespace, name);
    this._svgIcon = svgIcon.then((v) => unsafeHTML(v));
    try {
      this.toggleAttribute('data-empty', !(await svgIcon));
    } catch {
      this.toggleAttribute('data-empty', true);
    }
  }

  protected async fetchSvgIcon(namespace: string, name: string): Promise<string> {
    return await getSvgContent(namespace, name, !this.noSanitize);
  }

  private _splitIconName(iconName: string): [string, string] {
    if (!iconName) {
      return ['', ''];
    }
    const parts = iconName.split(':');
    switch (parts.length) {
      case 1:
        // Use default namespace if empty.
        return [SbbIconBase._defaultNamespace, parts[0]];
      case 2:
        return parts as [string, string];
      default:
        throw Error(`Invalid icon name: "${iconName}"`);
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);
    this.setAttribute('role', this.getAttribute('role') ?? 'img');
  }

  protected override render(): TemplateResult {
    return html`<span class="sbb-icon-inner"
      >${until(
        this._svgIcon,
        // To reserve space, we need an empty svg to apply dimension to.
        html`<svg width="0" height="0"></svg>`,
      )}</span
    >`;
  }
}
