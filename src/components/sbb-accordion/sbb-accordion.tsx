import { toggleDatasetEntry } from '../../global/dom';
import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ConnectedAbortController } from '../../global/eventing';
import { SbbExpansionPanel } from '../sbb-expansion-panel/index';
import { TitleLevel } from '../sbb-title';
import Style from './sbb-accordion.scss?lit&inline';

/**
 * @slot unnamed - Use this to add one or more sbb-expansion-panel.
 */
@customElement('sbb-accordion')
export class SbbAccordion extends LitElement {
  public static override styles: CSSResult = Style;

  /** The heading level for the sbb-expansion-panel-headers within the component. */
  @property({ attribute: 'title-level' })
  public get titleLevel(): TitleLevel | null {
    return this._titleLevel;
  }
  public set titleLevel(value: TitleLevel | null) {
    const oldValue = this._titleLevel;
    this._titleLevel = value;
    this._setTitleLevelOnChildren();
    this.requestUpdate('titleLevel', oldValue);
  }
  private _titleLevel: TitleLevel | null = null;

  /** Whether the animation should be disabled. */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /** Whether more than one sbb-expansion-panel can be open at the same time. */
  @property({ type: Boolean })
  public get multi(): boolean {
    return this._multi;
  }
  public set multi(value: boolean) {
    const oldValue = this._multi;
    this._multi = value;
    this._resetExpansionPanels(this._multi, oldValue);
    this.requestUpdate('multi', oldValue);
  }
  private _multi: boolean = false;

  private _abort = new ConnectedAbortController(this);

  private _closePanels(e): void {
    if (e.target?.tagName !== 'SBB-EXPANSION-PANEL' || this.multi) {
      return;
    }

    this._expansionPanels
      .filter((panel) => panel !== e.target)
      .forEach((panel) => (panel.expanded = false));
  }

  private _resetExpansionPanels(newValue: boolean, oldValue: boolean): void {
    // If it's changing from "multi = true" to "multi = false", open the first panel and close all the others.
    const expansionPanels = this._expansionPanels;
    if (expansionPanels.length > 1 && oldValue && !newValue) {
      expansionPanels[0].expanded = true;
      expansionPanels
        .filter((_, index: number) => index > 0)
        .forEach((panel) => (panel.expanded = false));
    }
  }

  private _setTitleLevelOnChildren(): void {
    this._expansionPanels.forEach((panel) => (panel.titleLevel = this.titleLevel));
  }

  private get _expansionPanels(): SbbExpansionPanel[] {
    return Array.from(this.querySelectorAll('sbb-expansion-panel'));
  }

  private _setChildrenParameters(): void {
    const expansionPanels = this._expansionPanels;
    if (!expansionPanels) {
      return;
    }

    expansionPanels.forEach((panel: SbbExpansionPanel) => {
      panel.titleLevel = this.titleLevel;

      toggleDatasetEntry(panel, 'accordionFirst', false);
      toggleDatasetEntry(panel, 'accordionLast', false);

      if (this.disableAnimation) {
        panel.setAttribute('disable-animation', 'true');
      } else {
        panel.removeAttribute('disable-animation');
      }
    });
    toggleDatasetEntry(expansionPanels[0], 'accordionFirst', true);
    toggleDatasetEntry(expansionPanels[expansionPanels.length - 1], 'accordionLast', true);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('will-open', (e) => this._closePanels(e), { signal });
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-accordion">
        <slot @slotchange=${() => this._setChildrenParameters()}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-accordion': SbbAccordion;
  }
}
