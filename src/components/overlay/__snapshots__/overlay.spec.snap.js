/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-overlay renders"] = 
`<div class="sbb-overlay__container">
  <div
    class="sbb-overlay"
    id="sbb-overlay-0"
  >
    <div class="sbb-overlay__wrapper">
      <div class="sbb-overlay__header">
        <sbb-secondary-button
          aria-label="Close secondary window"
          class="sbb-overlay__close"
          icon-name="cross-small"
          sbb-overlay-close=""
          size="m"
          type="button"
        >
        </sbb-secondary-button>
      </div>
      <div class="sbb-overlay__content">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</div>
<sbb-screenreader-only>
</sbb-screenreader-only>
`;
/* end snapshot sbb-overlay renders */

snapshots["sbb-overlay A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-overlay A11y tree Chrome */

snapshots["sbb-overlay A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-overlay A11y tree Firefox */

snapshots["sbb-overlay A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-overlay A11y tree Safari */

