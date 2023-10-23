import { InterfaceSbbTabGroupTab } from './sbb-tab-group.custom';
import { isArrowKeyPressed, getNextElementIndex, interactivityChecker } from '../../global/a11y';
import { isValidAttribute, hostContext, toggleDatasetEntry } from '../../global/dom';
import { throttle, EventEmitter, ConnectedAbortController } from '../../global/eventing';
import { AgnosticMutationObserver, AgnosticResizeObserver } from '../../global/observers';
import { CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SbbTabTitle } from '../sbb-tab-title';
import { setAttribute } from '../../global/dom';
import { ref } from 'lit/directives/ref.js';
import Style from './sbb-tab-group.scss?lit&inline';

const tabObserverConfig: MutationObserverInit = {
  attributeFilter: ['active', 'disabled'],
};

const SUPPORTED_CONTENT_WRAPPERS = ['ARTICLE', 'DIV', 'SECTION', 'SBB-TAB-GROUP'];

let nextId = 0;

/**
 * @slot tab-bar - When you provide the `sbb-tab-title` tag through the unnamed slot,
 * it will be automatically moved to this slot. You do not need to use it directly.
 * @slot unnamed - Provide html-content to show as tab content.
 * Wrap the content in a `div`, a `section`, an `article` or provide a nested `sbb-tab-group`:
 * This is correct: `<div>Some text <p>Some other text</p></div>`
 * This is not correct: `<span>Some text</span><p>Some other text</p>`
 */
@customElement('sbb-tab-group')
export class SbbTabGroup extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    selectedTabChanged: 'did-change',
  };

  private _tabs: InterfaceSbbTabGroupTab[] = [];
  private _selectedTab: InterfaceSbbTabGroupTab;
  private _isNested: boolean;
  private _tabGroupElement: HTMLElement;
  private _tabContentElement: HTMLElement;
  private _abort = new ConnectedAbortController(this);
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
   * Size variant, either l or xl.
   */
  @property()
  public get size(): InterfaceSbbTabGroupTab['size'] {
    return this._size;
  }
  public set size(value: InterfaceSbbTabGroupTab['size']) {
    const oldValue = this._size;
    this._size = value;
    this._updateSize();
    this.requestUpdate('size', oldValue);
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
    SbbTabGroup.events.selectedTabChanged,
  );

  /**
   * Disables a tab by index.
   * @param tabIndex The index of the tab you want to disable.
   */
  public disableTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions.disable();
  }

  /**
   * Enables a tab by index.
   * @param tabIndex The index of the tab you want to enable.
   */
  public enableTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions.enable();
  }

  /**
   * Activates a tab by index.
   * @param tabIndex The index of the tab you want to activate.
   */
  public activateTab(tabIndex: number): void {
    this._tabs[tabIndex]?.tabGroupActions.select();
  }

  private _getTabs(): InterfaceSbbTabGroupTab[] {
    return Array.from(this.children).filter((child) =>
      /^SBB-TAB-TITLE$/u.test(child.tagName),
    ) as InterfaceSbbTabGroupTab[];
  }

  private get _enabledTabs(): InterfaceSbbTabGroupTab[] {
    return this._tabs.filter(
      (t) => !isValidAttribute(t, 'disabled') && interactivityChecker.isVisible(t),
    );
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._isNested = !!hostContext('sbb-tab-group', this);
  }

  protected override firstUpdated(): void {
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
    this._tabContentElement = this.shadowRoot.querySelector('div.tab-content');
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
      this._tabs[this.initialSelectedIndex].tabGroupActions.select();
    } else {
      this._enabledTabs[0]?.tabGroupActions.select();
    }
  }

  private _onTabAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes') {
        return;
      }
      const tab = mutation.target as InterfaceSbbTabGroupTab;

      if (mutation.attributeName === 'disabled') {
        if (isValidAttribute(tab, 'disabled') && tab !== this._selectedTab) {
          tab.tabGroupActions.disable();
        } else if (tab.disabled) {
          tab.tabGroupActions.enable();
        }
      }
      if (mutation.attributeName === 'active') {
        if (isValidAttribute(tab, 'active') && !tab.disabled) {
          tab.tabGroupActions.select();
        } else if (tab === this._selectedTab) {
          tab.setAttribute('active', '');
        }
      }
    }
  }

  private _onTabGroupElementResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      const tabTitles = (
        entry.target.firstElementChild as HTMLSlotElement
      ).assignedElements() as SbbTabTitle[];

      for (const tab of tabTitles) {
        toggleDatasetEntry(
          tab,
          'hasDivider',
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
        tab.setAttribute('active', '');
        tab.active = true;
        tab.tabIndex = 0;
        tab.setAttribute('aria-selected', 'true');
        tab.relatedContent?.setAttribute('active', '');
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
        if (!isValidAttribute(tab, 'disabled')) {
          tab.setAttribute('disabled', '');
        }
        tab.disabled = true;
        tab.tabIndex = -1;
        tab.setAttribute('aria-selected', 'false');
        tab.relatedContent?.removeAttribute('active');
        if (tab.active) {
          tab.removeAttribute('active');
          tab.active = false;
          this._enabledTabs[0]?.tabGroupActions.select();
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
            prevTab.tabGroupActions.deactivate();
            this._tabContentResizeObserver.unobserve(prevTab.relatedContent);
          }

          tab.tabGroupActions.activate();
          this._selectedTab = tab;

          this._tabContentResizeObserver.observe(tab.relatedContent);
          this._selectedTabChanged.emit();
        } else if (tab.disabled) {
          console.warn('You cannot activate a disabled tab');
        }
      },
    };
    if (SUPPORTED_CONTENT_WRAPPERS.includes(tab.nextElementSibling?.tagName)) {
      tab.relatedContent = tab.nextElementSibling as HTMLElement;
      tab.relatedContent.id = this._assignId();
      if (tab.relatedContent.nodeName !== 'SBB-TAB-GROUP') {
        tab.relatedContent.tabIndex = 0;
      }
    } else {
      tab.insertAdjacentHTML('afterend', '<div>No content.</div>');
      tab.relatedContent = tab.nextElementSibling as HTMLElement;
      console.warn(
        `Missing content: you should provide a related content for the tab ${tab.outerHTML}.`,
      );
    }
    tab.tabIndex = -1;
    tab.disabled = isValidAttribute(tab, 'disabled');
    tab.active = isValidAttribute(tab, 'active') && !tab.disabled;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.relatedContent.id);
    tab.setAttribute('aria-selected', 'false');
    tab.relatedContent.setAttribute('role', 'tabpanel');
    tab.relatedContent.removeAttribute('active');
    if (tab.active) {
      tab.relatedContent.setAttribute('active', '');
    }
    tab.addEventListener('click', () => {
      tab.tabGroupActions.select();
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
      enabledTabs[nextIndex]?.tabGroupActions.select();
      enabledTabs[nextIndex]?.focus();
      evt.preventDefault();
    }
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'class', this._isNested ? 'tab-group--nested' : '');

    return html`
      <div
        class="tab-group"
        role="tablist"
        ${ref((el) => (this._tabGroupElement = el as HTMLElement))}
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
    'sbb-tab-group': SbbTabGroup;
  }
}
