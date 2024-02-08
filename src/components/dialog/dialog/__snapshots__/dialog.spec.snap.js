/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-dialog renders"] = 
`<div class="sbb-dialog__container">
  <div
    class="sbb-dialog"
    id="sbb-dialog-0"
  >
    <div class="sbb-dialog__wrapper">
      <div class="sbb-dialog__header">
        <sbb-title
          aria-level="1"
          class="sbb-dialog__title"
          id="title"
          level="1"
          role="heading"
          visual-level="3"
        >
          <slot name="title">
          </slot>
        </sbb-title>
        <sbb-secondary-button
          aria-label="Close secondary window"
          class="sbb-dialog__close"
          data-action=""
          data-button=""
          data-sbb-button=""
          dir="ltr"
          icon-name="cross-small"
          role="button"
          sbb-dialog-close=""
          size="m"
          tabindex="0"
          type="button"
        >
        </sbb-secondary-button>
      </div>
      <div class="sbb-dialog__content">
        <slot>
        </slot>
      </div>
      <div class="sbb-dialog__footer">
        <slot name="action-group">
        </slot>
      </div>
    </div>
  </div>
</div>
<sbb-screenreader-only aria-live="polite">
</sbb-screenreader-only>
`;
/* end snapshot sbb-dialog renders */

snapshots["sbb-dialog A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-dialog A11y tree Chrome */

snapshots["sbb-dialog A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-dialog A11y tree Firefox */

snapshots["sbb-dialog A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-dialog A11y tree Safari */

