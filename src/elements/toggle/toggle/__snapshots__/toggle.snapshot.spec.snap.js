/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-toggle renders DOM"] = 
`<sbb-toggle
  role="radiogroup"
  size="m"
>
  <sbb-toggle-option
    aria-checked="true"
    checked=""
    data-slot-names="unnamed"
    role="radio"
    tabindex="0"
    value="Value one"
  >
    Value one
  </sbb-toggle-option>
  <sbb-toggle-option
    aria-checked="false"
    data-slot-names="unnamed"
    role="radio"
    tabindex="-1"
    value="Value two"
  >
    Value two
  </sbb-toggle-option>
</sbb-toggle>
`;
/* end snapshot sbb-toggle renders DOM */

snapshots["sbb-toggle renders Shadow DOM"] = 
`<div class="sbb-toggle">
  <slot>
  </slot>
</div>
`;
/* end snapshot sbb-toggle renders Shadow DOM */

snapshots["sbb-toggle renders A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "radio",
      "name": "Value one",
      "checked": true
    },
    {
      "role": "radio",
      "name": "Value two"
    }
  ]
}
</p>
`;
/* end snapshot sbb-toggle renders A11y tree Firefox */

snapshots["sbb-toggle renders A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "radio",
      "name": "Value one",
      "checked": true
    },
    {
      "role": "radio",
      "name": "Value two",
      "checked": false
    }
  ]
}
</p>
`;
/* end snapshot sbb-toggle renders A11y tree Chrome */

