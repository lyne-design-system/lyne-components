import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import Style from './sbb-train-blocked-passage.scss?lit&inline';

@customElement('sbb-train-blocked-passage')
export class SbbTrainBlockedPassage extends LitElement {
  public static override styles: CSSResult = Style;

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-train-blocked-passage">
        <span class="sbb-train-blocked-passage__wrapper">
          <span class="sbb-train-blocked-passage__icon"></span>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-train-blocked-passage': SbbTrainBlockedPassage;
  }
}
