import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { getNextElementIndex, isArrowKeyPressed } from '../../core/a11y.js';
import { SbbConnectedAbortController } from '../../core/controllers.js';
import { EventEmitter, throttle } from '../../core/eventing.js';
import { AgnosticMutationObserver, AgnosticResizeObserver } from '../../core/observers.js';
import type { SbbTabTitleElement } from '../tab-title.js';

import style from './tab-group.scss?lit&inline';

export interface InterfaceSbbTabGroupActions {
  activate(): void;
  deactivate(): void;
  enable(): void;
  disable(): void;
  select(): void;
}

export interface InterfaceSbbTabGroupTab extends HTMLElement {
  active?: boolean;
  disabled?: boolean;
  relatedContent?: HTMLElement;
  index?: number;
  tabGroupActions?: InterfaceSbbTabGroupActions;
  size: 's' | 'l' | 'xl';
}

const tabObserverConfig: MutationObserverInit = {
  attributeFilter: ['active', 'disabled'],
};

const SUPPORTED_CONTENT_WRAPPERS = ['article', 'div', 'section', 'sbb-tab-group'];

let nextId = 0;

/**
 * It displays one or more tab, each one with a title and a content.
 *
 * @slot - Use the unnamed slot to add html-content to the `sbb-tab-group`.
 * Wrap the content in a `div`, a `section`, an `article` or provide a nested `sbb-tab-group`:
 * This is correct: `<div>Some text <p>Some other text</p></div>`
 * This is not correct: `<span>Some text</span><p>Some other text</p>`
 * @slot tab-bar - When you provide the `sbb-tab-title` tag through the unnamed slot,
 * it will be automatically moved to this slot. You do not need to use it directly.
 * @event {CustomEvent<void>} didChange - Emits an event on selected tab change
 */
@customElement('sbb-tab-group')
export class SbbTabGroupElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
  } as const;

  private _tabs: InterfaceSbbTabGroupTab[] = [];
  private _selectedTab?: InterfaceSbbTabGroupTab;
  private _tabGroupElement!: HTMLElement;
  private _tabContentElement!: HTMLElement;
  private _abort = new SbbConnectedAbortController(this);
  private _tabAttributeObserver = new AgnosticMutationObserver((mutationsList) =>
    this._onTabAttributesChange(mutationsList),
  );
  private _tabGroupResizeObserver = new AgnosticResizeObserver((entries) =>
    this._onTabGroupElementResize(entries),
  );
  private _tabContentResizeObserver = new AgnosticResizeObserver((entries) =>
    this._onTabContentElementResize(entries),
  );

  /**
   * Size variant, either s, l or xl.
   */
  @property()
  public set size(value: InterfaceSbbTabGroupTab['size']) {
    this._size = value;
    this._updateSize();
  }
  public get size(): InterfaceSbbTabGroupTab['size'] {
    return this._size;
  }
  private _size: InterfaceSbbTabGroupTab['size'] = 'l';

  /**
   * Sets the initial tab. If it matches a disabled tab or exceeds the length of
   * the tab group, the first enabled tab will be selected.
   */
  @property({ attribute: 'initial-selected-index', type: Number }) public initialSelectedIndex = 0;

  private _updateSize(): void {
    for (const tab of this._tabs) {
      tab.setAttribute('data-size', this.size);
    }
  }

  /**
   * Emits an event on selected tab change
   */
  private _selectedTabChanged: EventEmitter<void> = new EventEmitter(
    this,
    SbbTabGroupElement.events.didChange,
  );

  /**
   * Disables a tab by index.
   * @param tabIndex The index of the tab you want to disable.
   */
  public disableTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions?.disable();
  }

  /**
   * Enables a tab by index.
   * @param tabIndex The index of the tab you want to enable.
   */
  public enableTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions?.enable();
  }

  /**
   * Activates a tab by index.
   * @param tabIndex The index of the tab you want to activate.
   */
  public activateTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions?.select();
  }

  private _getTabs(): InterfaceSbbTabGroupTab[] {
    return Array.from(this.children ?? []).filter((child) =>
      /^sbb-tab-title$/u.test(child.localName),
    ) as InterfaceSbbTabGroupTab[];
  }

  private get _enabledTabs(): InterfaceSbbTabGroupTab[] {
    return this._tabs.filter((t) => !t.hasAttribute('disabled'));
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this.toggleAttribute('data-nested', !!this.parentElement?.closest('sbb-tab-group'));
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this._tabs = this._getTabs();
    this._tabs.forEach((tab) => this._configure(tab));
    this._initSelection();
    this._tabGroupResizeObserver.observe(this._tabGroupElement);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._tabAttributeObserver.disconnect();
    this._tabContentResizeObserver.disconnect();
    this._tabGroupResizeObserver.disconnect();
  }

  private _onContentSlotChange = (): void => {
    this._tabContentElement = this.shadowRoot!.querySelector('div.tab-content')!;
    const loadedTabs = this._getTabs().filter((tab) => !this._tabs.includes(tab));

    // if a new tab/content is added to the tab group
    if (loadedTabs.length) {
      loadedTabs.forEach((tab) => this._configure(tab));
      this._tabs = this._tabs.concat(loadedTabs);
    }
  };

  private _onTabsSlotChange = (): void => {
    const tabs = this._getTabs();

    // if a tab is removed from the tab group
    if (tabs.length < this._tabs.length) {
      const removedTabs = this._tabs.filter((tab) => !tabs.includes(tab));

      removedTabs.forEach((removedTab) => {
        removedTab.relatedContent?.remove();
      });
      this._tabs = tabs;
    }
    this._tabs.forEach((tab: InterfaceSbbTabGroupTab) => tab.setAttribute('data-size', this.size));
  };

  private _assignId(): string {
    return `sbb-tab-panel-${++nextId}`;
  }

  private _initSelection(): void {
    if (
      this.initialSelectedIndex >= 0 &&
      this.initialSelectedIndex < this._tabs.length &&
      !this._tabs[this.initialSelectedIndex].disabled
    ) {
      this._tabs[this.initialSelectedIndex].tabGroupActions?.select();
    } else {
      this._enabledTabs[0]?.tabGroupActions?.select();
    }
  }

  private _onTabAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes') {
        return;
      }
      const tab = mutation.target as InterfaceSbbTabGroupTab;

      if (mutation.attributeName === 'disabled') {
        if (tab.hasAttribute('disabled') && tab !== this._selectedTab) {
          tab.tabGroupActions?.disable();
        } else if (tab.disabled) {
          tab.tabGroupActions?.enable();
        }
      }
      if (mutation.attributeName === 'active') {
        if (tab.hasAttribute('active') && !tab.disabled) {
          tab.tabGroupActions?.select();
        } else if (tab === this._selectedTab) {
          tab.toggleAttribute('active', true);
        }
      }
    }
  }

  private _onTabGroupElementResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      const tabTitles = (
        entry.target.firstElementChild as HTMLSlotElement
      ).assignedElements() as SbbTabTitleElement[];

      for (const tab of tabTitles) {
        tab.toggleAttribute(
          'data-has-divider',
          tab === tabTitles[0] || tab.offsetLeft === tabTitles[0].offsetLeft,
        );
        this.style.setProperty('--sbb-tab-group-width', `${this._tabGroupElement.clientWidth}px`);
      }
    }
  }

  private _onTabContentElementResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      const contentHeight = Math.floor(entry.contentRect.height);

      (this._tabContentElement as HTMLElement).style.height = `${contentHeight}px`;
    }
  }

  private _configure(tab: InterfaceSbbTabGroupTab): void {
    tab.tabGroupActions = {
      activate: (): void => {
        tab.toggleAttribute('active', true);
        tab.active = true;
        tab.tabIndex = 0;
        tab.setAttribute('aria-selected', 'true');
        tab.relatedContent?.toggleAttribute('active', true);
      },
      deactivate: (): void => {
        tab.removeAttribute('active');
        tab.active = false;
        tab.tabIndex = -1;
        tab.setAttribute('aria-selected', 'false');
        tab.relatedContent?.removeAttribute('active');
      },
      disable: (): void => {
        if (tab.disabled) {
          return;
        }
        if (!tab.hasAttribute('disabled')) {
          tab.toggleAttribute('disabled', true);
        }
        tab.disabled = true;
        tab.tabIndex = -1;
        tab.setAttribute('aria-selected', 'false');
        tab.relatedContent?.removeAttribute('active');
        if (tab.active) {
          tab.removeAttribute('active');
          tab.active = false;
          this._enabledTabs[0]?.tabGroupActions?.select();
        }
      },
      enable: (): void => {
        if (tab.disabled) {
          tab.removeAttribute('disabled');
          tab.disabled = false;
        }
      },
      select: (): void => {
        if (tab !== this._selectedTab && !tab.disabled) {
          const prevTab = this._selectedTab;

          if (prevTab) {
            prevTab.tabGroupActions?.deactivate();
            this._tabContentResizeObserver.unobserve(prevTab.relatedContent!);
          }

          tab.tabGroupActions?.activate();
          this._selectedTab = tab;

          this._tabContentResizeObserver.observe(tab.relatedContent!);
          this._selectedTabChanged.emit();
        } else if (import.meta.env.DEV && tab.disabled) {
          console.warn('You cannot activate a disabled tab');
        }
      },
    };
    if (
      tab.nextElementSibling?.localName &&
      SUPPORTED_CONTENT_WRAPPERS.includes(tab.nextElementSibling?.localName)
    ) {
      tab.relatedContent = tab.nextElementSibling as HTMLElement;
      tab.relatedContent.id = this._assignId();
      if (tab.relatedContent.nodeName !== 'SBB-TAB-GROUP') {
        tab.relatedContent.tabIndex = 0;
      }
    } else {
      tab.insertAdjacentHTML('afterend', '<div>No content.</div>');
      tab.relatedContent = tab.nextElementSibling as HTMLElement;
      if (import.meta.env.DEV) {
        console.warn(
          `Missing content: you should provide a related content for the tab ${tab.outerHTML}.`,
        );
      }
    }
    tab.tabIndex = -1;
    tab.disabled = tab.hasAttribute('disabled');
    tab.active = tab.hasAttribute('active') && !tab.disabled;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.relatedContent.id);
    tab.setAttribute('aria-selected', 'false');
    tab.relatedContent.setAttribute('role', 'tabpanel');
    tab.relatedContent.toggleAttribute('active', tab.active);
    tab.addEventListener('click', () => {
      tab.tabGroupActions?.select();
    });

    this._tabAttributeObserver.observe(tab, tabObserverConfig);
    tab.slot = 'tab-bar';
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    const enabledTabs: InterfaceSbbTabGroupTab[] = this._enabledTabs;

    if (
      !enabledTabs ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this && (evt.target as HTMLElement).parentElement !== this)
    ) {
      return;
    }

    if (isArrowKeyPressed(evt)) {
      const current: number = enabledTabs.findIndex((t: InterfaceSbbTabGroupTab) => t.active);
      const nextIndex: number = getNextElementIndex(evt, current, enabledTabs.length);
      enabledTabs[nextIndex]?.tabGroupActions?.select();
      enabledTabs[nextIndex]?.focus();
      evt.preventDefault();
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div
        class="tab-group"
        role="tablist"
        ${ref((el?: Element) => (this._tabGroupElement = el as HTMLElement))}
      >
        <slot name="tab-bar" @slotchange=${this._onTabsSlotChange}></slot>
      </div>

      <div class="tab-content">
        <slot @slotchange=${throttle(this._onContentSlotChange, 150)}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tab-group': SbbTabGroupElement;
  }
}
