/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-checkbox-group renders - DOM"] = 
`<sbb-checkbox-group
  data-slot-names="unnamed"
  orientation="horizontal"
>
  <sbb-checkbox
    data-slot-names="unnamed"
    icon-placement="end"
    size="m"
    tabindex="0"
    value="checkbox-1"
  >
    Label 1
  </sbb-checkbox>
  <sbb-checkbox
    data-slot-names="unnamed"
    icon-placement="end"
    size="m"
    tabindex="0"
    value="checkbox-2"
  >
    Label 2
  </sbb-checkbox>
  <sbb-checkbox
    data-slot-names="unnamed"
    icon-placement="end"
    size="m"
    tabindex="0"
    value="checkbox-3"
  >
    Label 3
  </sbb-checkbox>
</sbb-checkbox-group>
`;
/* end snapshot sbb-checkbox-group renders - DOM */

snapshots["sbb-checkbox-group renders - Shadow DOM"] = 
`<div class="sbb-checkbox-group">
  <slot>
  </slot>
</div>
<div class="sbb-checkbox-group__error">
  <slot name="error">
  </slot>
</div>
`;
/* end snapshot sbb-checkbox-group renders - Shadow DOM */

snapshots["sbb-checkbox-group A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label 1",
      "checked": false
    },
    {
      "role": "checkbox",
      "name": "​ Label 2",
      "checked": false
    },
    {
      "role": "checkbox",
      "name": "​ Label 3",
      "checked": false
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox-group A11y tree Chrome */

snapshots["sbb-checkbox-group A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "checkbox",
      "name": "​ Label 1"
    },
    {
      "role": "checkbox",
      "name": "​ Label 2"
    },
    {
      "role": "checkbox",
      "name": "​ Label 3"
    }
  ]
}
</p>
`;
/* end snapshot sbb-checkbox-group A11y tree Firefox */

