/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-expansion-panel-header renders collapsed"] = 
`<span class="sbb-action-base sbb-expansion-panel-header">
  <span class="sbb-expansion-panel-header__title">
    <span class="sbb-expansion-panel-header__icon">
      <slot name="icon">
      </slot>
    </span>
    <slot>
    </slot>
  </span>
  <span class="sbb-expansion-panel-header__toggle">
    <sbb-icon
      aria-hidden="true"
      class="sbb-expansion-panel-header__toggle-icon"
      data-namespace="default"
      name="chevron-small-down-medium"
      role="img"
    >
    </sbb-icon>
  </span>
</span>
`;
/* end snapshot sbb-expansion-panel-header renders collapsed */

snapshots["sbb-expansion-panel-header renders with icon"] = 
`<span class="sbb-action-base sbb-expansion-panel-header">
  <span class="sbb-expansion-panel-header__title">
    <span class="sbb-expansion-panel-header__icon">
      <slot name="icon">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="pie-medium"
          role="img"
        >
        </sbb-icon>
      </slot>
    </span>
    <slot>
    </slot>
  </span>
  <span class="sbb-expansion-panel-header__toggle">
    <sbb-icon
      aria-hidden="true"
      class="sbb-expansion-panel-header__toggle-icon"
      data-namespace="default"
      name="chevron-small-down-medium"
      role="img"
    >
    </sbb-icon>
  </span>
</span>
`;
/* end snapshot sbb-expansion-panel-header renders with icon */

snapshots["sbb-expansion-panel-header renders with slotted icon"] = 
`<span class="sbb-action-base sbb-expansion-panel-header">
  <span class="sbb-expansion-panel-header__title">
    <span class="sbb-expansion-panel-header__icon">
      <slot name="icon">
      </slot>
    </span>
    <slot>
    </slot>
  </span>
  <span class="sbb-expansion-panel-header__toggle">
    <sbb-icon
      aria-hidden="true"
      class="sbb-expansion-panel-header__toggle-icon"
      data-namespace="default"
      name="chevron-small-down-medium"
      role="img"
    >
    </sbb-icon>
  </span>
</span>
`;
/* end snapshot sbb-expansion-panel-header renders with slotted icon */

snapshots["sbb-expansion-panel-header A11y tree Chrome"] = 
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
/* end snapshot sbb-expansion-panel-header A11y tree Chrome */

snapshots["sbb-expansion-panel-header A11y tree Firefox"] = 
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
/* end snapshot sbb-expansion-panel-header A11y tree Firefox */

