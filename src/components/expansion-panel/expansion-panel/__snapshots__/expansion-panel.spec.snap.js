/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-expansion-panel renders Dom"] = 
`<sbb-expansion-panel>
  <sbb-expansion-panel-header
    aria-controls="sbb-expansion-panel-content-1"
    aria-expanded="false"
    data-action=""
    data-button=""
    data-slot-names="unnamed"
    dir="ltr"
    id="sbb-expansion-panel-header-1"
    role="button"
    slot="header"
    tabindex="0"
  >
    Header
  </sbb-expansion-panel-header>
  <sbb-expansion-panel-content
    aria-hidden="true"
    aria-labelledby="sbb-expansion-panel-header-1"
    id="sbb-expansion-panel-content-1"
    role="region"
    slot="content"
  >
    Content
  </sbb-expansion-panel-content>
</sbb-expansion-panel>
`;
/* end snapshot sbb-expansion-panel renders Dom */

snapshots["sbb-expansion-panel renders ShadowDom"] = 
`<div class="sbb-expansion-panel">
  <div class="sbb-expansion-panel__header">
    <slot name="header">
    </slot>
  </div>
  <div class="sbb-expansion-panel__content-wrapper">
    <span class="sbb-expansion-panel__content">
      <slot name="content">
      </slot>
    </span>
  </div>
</div>
`;
/* end snapshot sbb-expansion-panel renders ShadowDom */

snapshots["sbb-expansion-panel renders with level set Dom"] = 
`<sbb-expansion-panel title-level="4">
  <sbb-expansion-panel-header
    aria-controls="sbb-expansion-panel-content-3"
    aria-expanded="false"
    data-action=""
    data-button=""
    data-slot-names="unnamed"
    dir="ltr"
    id="sbb-expansion-panel-header-3"
    role="button"
    slot="header"
    tabindex="0"
  >
    Header
  </sbb-expansion-panel-header>
  <sbb-expansion-panel-content
    aria-hidden="true"
    aria-labelledby="sbb-expansion-panel-header-3"
    id="sbb-expansion-panel-content-3"
    role="region"
    slot="content"
  >
    Content
  </sbb-expansion-panel-content>
</sbb-expansion-panel>
`;
/* end snapshot sbb-expansion-panel renders with level set Dom */

snapshots["sbb-expansion-panel renders with level set ShadowDom"] = 
`<div class="sbb-expansion-panel">
  <h4 class="sbb-expansion-panel__header">
    <slot name="header">
    </slot>
  </h4>
  <div class="sbb-expansion-panel__content-wrapper">
    <span class="sbb-expansion-panel__content">
      <slot name="content">
      </slot>
    </span>
  </div>
</div>
`;
/* end snapshot sbb-expansion-panel renders with level set ShadowDom */

snapshots["sbb-expansion-panel renders with level set A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Header"
    }
  ]
}
</p>
`;
/* end snapshot sbb-expansion-panel renders with level set A11y tree Chrome */

snapshots["sbb-expansion-panel renders with level set A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Header"
    }
  ]
}
</p>
`;
/* end snapshot sbb-expansion-panel renders with level set A11y tree Firefox */

