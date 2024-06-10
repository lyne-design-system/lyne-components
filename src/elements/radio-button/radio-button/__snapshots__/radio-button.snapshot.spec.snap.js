/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-radio-button renders - DOM"] = 
`<sbb-radio-button
  aria-checked="false"
  aria-required="false"
  role="radio"
  size="m"
  value="radio-value"
>
</sbb-radio-button>
`;
/* end snapshot sbb-radio-button renders - DOM */

snapshots["sbb-radio-button renders - Shadow DOM"] = 
`<label class="sbb-radio-button">
  <input
    aria-hidden="true"
    class="sbb-screen-reader-only"
    tabindex="-1"
    type="radio"
    value="radio-value"
  >
  <span class="sbb-radio-button__label-slot">
    <slot>
    </slot>
  </span>
</label>
`;
/* end snapshot sbb-radio-button renders - Shadow DOM */

snapshots["sbb-radio-button A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "radio",
      "name": "",
      "checked": false
    }
  ]
}
</p>
`;
/* end snapshot sbb-radio-button A11y tree Chrome */

snapshots["sbb-radio-button A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "radio",
      "name": ""
    }
  ]
}
</p>
`;
/* end snapshot sbb-radio-button A11y tree Firefox */

