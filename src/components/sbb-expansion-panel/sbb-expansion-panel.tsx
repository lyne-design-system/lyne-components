import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop,
  Watch,
} from '@stencil/core';
import { InterfaceTitleAttributes } from '../sbb-title/sbb-title.custom';
import { toggleDatasetEntry } from '../../global/dom';
import { InterfaceSbbExpansionPanelAttributes } from './sbb-expansion-panel.custom';

let nextId = 0;

/**
 * @slot header - Use this to render the sbb-expansion-panel-header.
 * @slot content - Use this to render the sbb-expansion-panel-content.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-expansion-panel.scss',
  tag: 'sbb-expansion-panel',
})
export class SbbExpansionPanel implements ComponentInterface {
  /** Heading level; if unset, a `div` will be rendered. */
  @Prop() public titleLevel?: InterfaceTitleAttributes['level'];

  /** The background color of the panel. */
  @Prop() public color: InterfaceSbbExpansionPanelAttributes['color'] = 'white';

  /** Whether the panel is expanded. */
  @Prop({ mutable: true, reflect: true }) public expanded = false;

  /** Whether the panel is disabled, so its expanded state can't be changed. */
  @Prop({ reflect: true }) public disabled = false;

  /** Whether the panel has no border. */
  @Prop({ reflect: true }) public borderless = false;

  /** Whether the animations should be disabled. */
  @Prop({ reflect: true }) public disableAnimation = false;

  /** Emits whenever the sbb-expansion-panel starts the opening transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /** Emits whenever the sbb-expansion-panel is opened. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /** Emits whenever the sbb-expansion-panel begins the closing transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<void>;

  /** Emits whenever the sbb-expansion-panel is closed. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<void>;

  @Element() private _element: HTMLElement;

  @Listen('toggle-expanded')
  public toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  @Watch('expanded')
  public onExpandedChange(): void {
    this._element
      .querySelector('sbb-expansion-panel-header')
      .setAttribute('expanded', String(this.expanded));
    this._element
      .querySelector('sbb-expansion-panel-content')
      .setAttribute('aria-hidden', String(!this.expanded));
    this._element.style.setProperty(
      '--sbb-expansion-panel-content-height',
      `${this._contentElement.scrollHeight}px`,
    );

    if (this.expanded) {
      this.willOpen.emit();
      this.disableAnimation && this.didOpen.emit();
    } else {
      this.willClose.emit();
      this.disableAnimation && this.didClose.emit();
    }
  }

  private _contentElement: HTMLElement;
  private _transitionEventController: AbortController;
  private _progressiveId = `-${++nextId}`;

  private _onHeaderSlotChange(event): void {
    const header = (event.target as HTMLSlotElement)
      .assignedElements()
      .find(
        (e): e is HTMLSbbExpansionPanelHeaderElement => e.tagName === 'SBB-EXPANSION-PANEL-HEADER',
      );
    if (!header) {
      return;
    }

    header.setAttribute('expanded', String(this.expanded));
    if (this.disabled) {
      header.setAttribute('disabled', String(this.disabled));
    }
    if (!header.getAttribute('id')) {
      header.setAttribute('id', `sbb-expansion-panel-header${this._progressiveId}`);
    }

    const content = this._element.querySelector('sbb-expansion-panel-content');
    if (content) {
      header.setAttribute(
        'aria-controls',
        content.getAttribute('id') || `sbb-expansion-panel-content${this._progressiveId}`,
      );
      toggleDatasetEntry(
        content,
        'iconSpace',
        header.hasAttribute('icon-name') && header.getAttribute('icon-name') !== '',
      );
    }
  }

  private _onContentSlotChange(event): void {
    const content = (event.target as HTMLSlotElement)
      .assignedElements()
      .find(
        (e): e is HTMLSbbExpansionPanelContentElement =>
          e.tagName === 'SBB-EXPANSION-PANEL-CONTENT',
      );
    if (!content) {
      return;
    }

    content.setAttribute('expanded', String(this.expanded));
    if (!content.getAttribute('id')) {
      content.setAttribute('id', `sbb-expansion-panel-content${this._progressiveId}`);
    }

    const header = this._element.querySelector('sbb-expansion-panel-header');
    content.setAttribute(
      'aria-labelledby',
      header.getAttribute('id') || `sbb-expansion-panel-header${this._progressiveId}`,
    );
    content.addEventListener('transitionend', (event) => this._onTransitionEnd(event), {
      signal: this._transitionEventController.signal,
    });
  }

  private _onTransitionEnd(event): void {
    if (event.propertyName !== 'opacity') {
      return;
    }

    if (this.expanded) {
      this.didOpen.emit();
    } else {
      this.didClose.emit();
    }
  }

  public connectedCallback(): void {
    this._transitionEventController = new AbortController();
  }

  public disconnectedCallback(): void {
    this._transitionEventController.abort();
  }

  public render(): JSX.Element {
    const TAGNAME = this.titleLevel ? `h${this.titleLevel}` : 'div';

    return (
      <div class="sbb-expansion-panel">
        <TAGNAME class="sbb-expansion-panel__header">
          <slot name="header" onSlotchange={(event) => this._onHeaderSlotChange(event)}></slot>
        </TAGNAME>
        <span class="sbb-expansion-panel__content" ref={(el) => (this._contentElement = el)}>
          <slot name="content" onSlotchange={(event) => this._onContentSlotChange(event)}></slot>
        </span>
      </div>
    );
  }
}
