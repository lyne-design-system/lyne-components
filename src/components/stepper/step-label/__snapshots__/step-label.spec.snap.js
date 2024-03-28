/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-step-label renders"] = 
`<div class="sbb-step-label">
  <span class="sbb-step-label__prefix">
    <slot name="icon">
    </slot>
  </span>
  <span class="sbb-step-label__text">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-step-label renders collapsed */

snapshots["sbb-step-label renders with icon"] = 
`<div class="sbb-step-label">
  <span class="sbb-step-label__prefix">
    <slot name="icon">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="tick-small"
        role="img"
      >
      </sbb-icon>
    </slot>
  </span>
  <span class="sbb-step-label__text">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-step-label renders with icon" */

snapshots["sbb-step-label renders disabled"] = 
`<div class="sbb-step-label">
  <span class="sbb-step-label__prefix">
    <slot name="icon">
    </slot>
  </span>
  <span class="sbb-step-label__text">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-step-label renders disabled" */

snapshots["sbb-step-label A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "tab",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step-label A11y tree Chrome */

snapshots["sbb-step-label A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "tab",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step-label A11y tree Firefox */

snapshots["sbb-step-label A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "tab",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step-label A11y tree Safari */

