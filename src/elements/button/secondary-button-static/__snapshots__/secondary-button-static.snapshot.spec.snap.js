/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static without icon DOM"] = 
`<sbb-secondary-button-static
  data-action=""
  data-sbb-button=""
  data-slot-names="unnamed"
  dir="ltr"
  disabled=""
  negative=""
  size="m"
>
  Label Text
</sbb-secondary-button-static>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static without icon DOM */

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static without icon Shadow DOM"] = 
`<span class="sbb-action-base sbb-secondary-button-static">
  <slot name="icon">
  </slot>
  <span class="sbb-button__label">
    <slot>
    </slot>
  </span>
</span>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static without icon Shadow DOM */

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon DOM"] = 
`<sbb-secondary-button-static
  data-action=""
  data-sbb-button=""
  data-slot-names="icon unnamed"
  dir="ltr"
  size="l"
>
  <sbb-icon
    aria-hidden="true"
    data-namespace="default"
    name="chevron-small-left-small"
    role="img"
    slot="icon"
  >
  </sbb-icon>
  Label Text
</sbb-secondary-button-static>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon DOM */

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon Shadow DOM"] = 
`<span class="sbb-action-base sbb-secondary-button-static">
  <slot name="icon">
  </slot>
  <span class="sbb-button__label">
    <slot>
    </slot>
  </span>
</span>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon Shadow DOM */

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Label Text"
    }
  ]
}
</p>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon A11y tree Chrome */

snapshots["sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Label Text "
    }
  ]
}
</p>
`;
/* end snapshot sbb-secondary-button-static renders a sbb-secondary-button-static with slotted icon A11y tree Firefox */

