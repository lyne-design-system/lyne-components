import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { SbbHydrationMixin } from '../../core/common-behaviors';
import { EventEmitter, ConnectedAbortController } from '../../core/eventing';
import type { SbbOverlayState } from '../../core/overlay';
import type { SbbTitleLevel } from '../../title';
import type { SbbExpansionPanelContentElement } from '../expansion-panel-content';
import type { SbbExpansionPanelHeaderElement } from '../expansion-panel-header';

import style from './expansion-panel.scss?lit&inline';

let nextId = 0;

/**
 * It displays an expandable summary-details widget.
 *
 * @slot - Use the unnamed slot to add a `sbb-expansion-panel-header` and a `sbb-expansion-panel-content` element.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-expansion-panel` starts the opening transition.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-expansion-panel` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-expansion-panel` begins the closing transition.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-expansion-panel` is closed.
 */
@customElement('sbb-expansion-panel')
export class SbbExpansionPanelElement extends SbbHydrationMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** Heading level; if unset, a `div` will be rendered. */
  @property({ attribute: 'title-level' }) public titleLevel?: SbbTitleLevel | null;

  /** The background color of the panel. */
  @property() public color: 'white' | 'milk' = 'white';

  /** Whether the panel is expanded. */
  @property({ reflect: true, type: Boolean })
  public set expanded(value: boolean) {
    this._expanded = value;
    this._onExpandedChange();
  }
  public get expanded(): boolean {
    return this._expanded;
  }
  private _expanded: boolean = false;

  /** Whether the panel is disabled, so its expanded state can't be changed. */
  @property({ reflect: true, type: Boolean })
  public set disabled(value: boolean) {
    this._disabled = value;
    this._updateDisabledOnHeader(this._disabled);
  }
  public get disabled(): boolean {
    return this._disabled;
  }
  private _disabled: boolean = false;

  /** Whether the panel has no border. */
  @property({ reflect: true, type: Boolean }) public borderless = false;

  /** Emits whenever the `sbb-expansion-panel` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbExpansionPanelElement.events.willOpen,
  );

  /** Emits whenever the `sbb-expansion-panel` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbExpansionPanelElement.events.didOpen,
  );

  /** Emits whenever the `sbb-expansion-panel` begins the closing transition. */
  private _willClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbExpansionPanelElement.events.willClose,
  );

  /** Emits whenever the `sbb-expansion-panel` is closed. */
  private _didClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbExpansionPanelElement.events.didClose,
  );

  private _abort = new ConnectedAbortController(this);
  private _state: SbbOverlayState = 'closed';

  private _toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  private _onExpandedChange(): void {
    this._headerRef?.setAttribute('aria-expanded', String(this.expanded));
    this._contentRef?.setAttribute('aria-hidden', String(!this.expanded));

    if (this.expanded) {
      this._willOpen.emit();
      this._state = 'opening';
    } else if (this._state === 'opened') {
      this._willClose.emit();
      this._state = 'closing';
    }
  }

  private _updateDisabledOnHeader(newDisabledValue: boolean): void {
    if (this._headerRef) {
      this._headerRef.disabled = newDisabledValue;
    }
  }

  private _transitionEventController!: AbortController;
  private _progressiveId = `-${++nextId}`;
  private _headerRef?: SbbExpansionPanelHeaderElement;
  private _contentRef?: SbbExpansionPanelContentElement;

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('toggleExpanded', () => this._toggleExpanded(), { signal });
    const accordion = this.closest?.('sbb-accordion');
    this.toggleAttribute('data-accordion', !!accordion);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._transitionEventController?.abort();
    this.toggleAttribute('data-accordion', false);
  }

  private _handleSlotchange(): void {
    const children = Array.from(this.children ?? []);
    const header = children.find(
      (e): e is SbbExpansionPanelHeaderElement => e.tagName === 'SBB-EXPANSION-PANEL-HEADER',
    );
    const content = children.find(
      (e): e is SbbExpansionPanelContentElement => e.tagName === 'SBB-EXPANSION-PANEL-CONTENT',
    );
    if (this._headerRef === header && this._contentRef === content) {
      return;
    }
    if (header && this._headerRef !== header) {
      header.id ||= `sbb-expansion-panel-header${this._progressiveId}`;
      header.setAttribute('aria-expanded', String(this.expanded));
      header.toggleAttribute('disabled', this.disabled);
    }
    if (content && this._contentRef !== content) {
      content.id ||= `sbb-expansion-panel-content${this._progressiveId}`;
      content.setAttribute('aria-hidden', String(!this.expanded));
    }

    this._headerRef = header;
    this._contentRef = content;
    if (this._headerRef && this._contentRef) {
      this._headerRef.setAttribute('aria-controls', this._contentRef.id);
      this._contentRef.setAttribute('aria-labelledby', this._headerRef.id);
      this._contentRef.toggleAttribute(
        'data-icon-space',
        this._headerRef.hasAttribute('data-icon'),
      );
    }
  }

  private _onOpened(): void {
    this._didOpen.emit();
    this._state = 'opened';
  }

  private _onClosed(): void {
    this._didClose.emit();
    this._state = 'closed';
  }

  private _onTransitionEnd(event: TransitionEvent): void {
    // All transitions have the same timing and opacity is defined last, be sure that they have all been performed.
    if (event.propertyName !== 'opacity') {
      return;
    }

    if (this.expanded) {
      this._onOpened();
    } else {
      this._onClosed();
    }
  }

  protected override render(): TemplateResult {
    const TAGNAME = this.titleLevel ? `h${this.titleLevel}` : 'div';

    /* eslint-disable lit/binding-positions */
    return html`
      <div class="sbb-expansion-panel">
        <${unsafeStatic(TAGNAME)} class="sbb-expansion-panel__header">
          <slot name="header" @slotchange=${this._handleSlotchange}></slot>
        </${unsafeStatic(TAGNAME)}>
        <div class="sbb-expansion-panel__content-wrapper" @transitionend=${this._onTransitionEnd}>
          <span class="sbb-expansion-panel__content">
            <slot name="content" @slotchange=${this._handleSlotchange}></slot>
          </span>
        </div>
      </div>
    `;
    /* eslint-disable lit/binding-positions */
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-expansion-panel': SbbExpansionPanelElement;
  }
}
