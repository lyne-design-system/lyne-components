import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import {
  i18nFileSelectorButtonLabel,
  i18nFileSelectorCurrentlySelected,
  i18nFileSelectorDeleteFile,
  i18nFileSelectorSubtitleLabel,
} from '../../global/i18n';
import { toggleDatasetEntry } from '../../global/dom';
import { sbbInputModalityDetector } from '../../global/a11y';
import { CSSResult, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import Style from './sbb-file-selector.scss?lit&inline';
import '../sbb-button';
import '../sbb-icon';

export type DOMEvent = globalThis.Event;

/**
 * @slot error - Use this to provide a `sbb-form-error` to show an error message.
 */
@customElement('sbb-file-selector')
export class SbbFileSelector extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    fileChangedEvent: 'file-changed',
  };

  /** Whether the component has a dropzone area or not. */
  @property() public variant: 'default' | 'dropzone' = 'default';

  /** Whether more than one file can be selected. */
  @property({ type: Boolean }) public multiple: boolean;

  /** Whether the newly added files should override the previously added ones. */
  @property({ attribute: 'multiple-mode' })
  public multipleMode: 'default' | 'persistent';

  /** A comma-separated list of allowed unique file type specifiers. */
  @property() public accept: string;

  /** The title displayed in `dropzone` variant. */
  @property({ attribute: 'title-content' }) public titleContent?: string;

  /** Whether the component is disabled. */
  @property({ reflect: true, type: Boolean }) public disabled: boolean;

  /** This will be forwarded as aria-label to the native input element. */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /** The list of selected files. */
  @state() private _files: File[];

  /** Current document language used for translations. */
  @state() private _currentLanguage = documentLanguage();

  /** State of listed named slots, by indicating whether any element for a named slot is defined. */
  @state() private _namedSlots = createNamedSlotState('error');

  /** An event which is emitted each time the file list changes. */
  private _fileChangedEvent: EventEmitter<File[]> = new EventEmitter(
    this,
    SbbFileSelector.events.fileChangedEvent,
  );

  /**
   * Gets the currently selected files.
   */
  public get files(): File[] {
    return this._files || [];
  }

  /**
   * @deprecated use 'files' property instead
   */
  public getFiles(): File[] {
    return this._files || [];
  }

  // Safari has a peculiar behavior when dragging files on the inner button in 'dropzone' variant;
  // this will require a counter to correctly handle the dragEnter/dragLeave.
  private _counter: number = 0;

  private _loadButton: HTMLElement;
  private _dragTarget: HTMLElement;
  private _hiddenInput: HTMLInputElement;
  private _suffixes: string[] = ['B', 'kB', 'MB', 'GB', 'TB'];
  private _liveRegion: HTMLElement;

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  private _blockEvent(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private _checkFileEquality(file1: File, file2: File): boolean {
    return (
      file1.name === file2.name &&
      file1.size === file2.size &&
      file1.lastModified === file2.lastModified
    );
  }

  private _onDragEnter(event: DragEvent): void {
    this._counter++;
    if (!this.disabled) {
      this._setDragState(event.target as HTMLElement, true);
      this._blockEvent(event);
    }
  }

  private _onDragLeave(event: DragEvent): void {
    this._counter--;
    if (!this.disabled && event.target === this._dragTarget && this._counter === 0) {
      this._setDragState();
      this._blockEvent(event);
    }
  }

  private _onFileDrop(event: DragEvent): void {
    this._counter = 0;
    if (!this.disabled) {
      this._setDragState();
      this._blockEvent(event);
      this._createFileList(event.dataTransfer.files);
    }
  }

  private _onFocus(): void {
    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      toggleDatasetEntry(this._loadButton, 'focusVisible', true);
    }
  }

  private _onBlur(): void {
    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      toggleDatasetEntry(this._loadButton, 'focusVisible', false);
    }
  }

  private _setDragState(dragTarget: HTMLElement = undefined, isDragEnter: boolean = false): void {
    this._dragTarget = dragTarget;
    toggleDatasetEntry(this, 'active', isDragEnter);
    toggleDatasetEntry(this._loadButton, 'active', isDragEnter);
  }

  private _readFiles(event: DOMEvent): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this._createFileList(fileInput.files);
    }
  }

  private _createFileList(files: FileList): void {
    if (
      !this.multiple ||
      this.multipleMode !== 'persistent' ||
      !this._files ||
      this._files.length === 0
    ) {
      this._files = Array.from(files);
    } else {
      this._files = Array.from(files)
        .filter(
          (newFile: File): boolean =>
            this._files.findIndex((oldFile: File) => this._checkFileEquality(newFile, oldFile)) ===
            -1,
        )
        .concat(this._files);
    }
    this._liveRegion.innerText = i18nFileSelectorCurrentlySelected(this._files.map((e) => e.name))[
      this._currentLanguage
    ];
    this._fileChangedEvent.emit(this._files);
  }

  private _removeFile(file: File): void {
    this._files = this._files.filter((f: File) => !this._checkFileEquality(file, f));
    // The item must be removed from the hidden file input too; the FileList API is flawed, so the DataTransfer object is used.
    const dt: DataTransfer = new DataTransfer();
    this._files.forEach((e: File) => dt.items.add(e));
    this._hiddenInput.files = dt.files;
    this._liveRegion.innerText = i18nFileSelectorCurrentlySelected(this._files.map((e) => e.name))[
      this._currentLanguage
    ];
    this._fileChangedEvent.emit(this._files);
  }

  /** Calculates the correct unit for the file's size. */
  private _formatFileSize(size: number): string {
    const i: number = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(0)} ${this._suffixes[i]}`;
  }

  private _renderDefaultMode(): TemplateResult {
    return html`
      <sbb-button
        variant="secondary"
        size="m"
        is-static
        icon-name="folder-open-small"
        ?disabled=${this.disabled}
        ${ref((el: HTMLElement): void => {
          this._loadButton = el;
        })}
      >
        ${i18nFileSelectorButtonLabel[this._currentLanguage]}
      </sbb-button>
    `;
  }

  private _renderDropzoneArea(): TemplateResult {
    return html`
      <span class="sbb-file-selector__dropzone-area">
        <span class="sbb-file-selector__dropzone-area--icon">
          <sbb-icon name="folder-open-medium"></sbb-icon>
        </span>
        <span class="sbb-file-selector__dropzone-area--title">${this.titleContent}</span>
        <span class="sbb-file-selector__dropzone-area--subtitle">
          ${i18nFileSelectorSubtitleLabel[this._currentLanguage]}
        </span>
        <span class="sbb-file-selector__dropzone-area--button">
          <sbb-button
            variant="secondary"
            size="m"
            ?disabled=${this.disabled}
            is-static
            ${ref((el: HTMLElement): void => {
              this._loadButton = el;
            })}
          >
            ${i18nFileSelectorButtonLabel[this._currentLanguage]}
          </sbb-button>
        </span>
      </span>
    `;
  }

  private _renderFileList(): TemplateResult {
    const TAG_NAME: Record<string, string> =
      this._files.length > 1
        ? { WRAPPER: 'ul', ELEMENT: 'li' }
        : { WRAPPER: 'div', ELEMENT: 'span' };

    /* eslint-disable lit/binding-positions */
    return html`
      <${unsafeStatic(TAG_NAME.WRAPPER)} class="sbb-file-selector__file-list">
        ${this._files.map(
          (file: File) => html`
          <${unsafeStatic(TAG_NAME.ELEMENT)} class="sbb-file-selector__file">
            <span class="sbb-file-selector__file-details">
              <span class="sbb-file-selector__file-name">${file.name}</span>
              <span class="sbb-file-selector__file-size">${this._formatFileSize(file.size)}</span>
            </span>
            <sbb-button
              variant="secondary"
              size="m"
              icon-name="trash-small"
              @click=${() => this._removeFile(file)}
              aria-label=${`${i18nFileSelectorDeleteFile[this._currentLanguage]} - ${file.name}`}
            ></sbb-button>
          </${unsafeStatic(TAG_NAME.ELEMENT)}>`,
        )}
      </${unsafeStatic(TAG_NAME.WRAPPER)}>
    `;
    /* eslint-disable lit/binding-positions */
  }

  protected override render(): TemplateResult {
    const ariaLabel = this.accessibilityLabel
      ? `${i18nFileSelectorButtonLabel[this._currentLanguage]} - ${this.accessibilityLabel}`
      : undefined;
    return html`
      <div class="sbb-file-selector">
        <div
          class="sbb-file-selector__input-container"
          @dragenter=${this._onDragEnter}
          @dragover=${this._blockEvent}
          @dragleave=${this._onDragLeave}
          @drop=${this._onFileDrop}
        >
          <label>
            ${this.variant === 'default' ? this._renderDefaultMode() : this._renderDropzoneArea()}
            <input
              class="sbb-file-selector__visually-hidden"
              type="file"
              ?disabled=${this.disabled}
              ?multiple=${this.multiple}
              accept=${this.accept || nothing}
              aria-label=${ariaLabel || nothing}
              @change=${this._readFiles}
              @focus=${this._onFocus}
              @blur=${this._onBlur}
              ${ref((el: HTMLInputElement): void => {
                this._hiddenInput = el;
              })}
            />
          </label>
        </div>
        <p
          role="status"
          class="sbb-file-selector__visually-hidden"
          ${ref((p: HTMLElement) => (this._liveRegion = p))}
        ></p>
        ${this._files && this._files.length > 0 ? this._renderFileList() : nothing}
        ${this._namedSlots.error
          ? html`<div class="sbb-file-selector__error">
              <slot name="error"></slot>
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-file-selector': SbbFileSelector;
  }
}
