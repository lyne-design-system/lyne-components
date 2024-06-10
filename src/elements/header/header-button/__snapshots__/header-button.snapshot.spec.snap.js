/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-header-button renders the component as a button with icon Light DOM"] = 
`<sbb-header-button
  aria-label="a11y label"
  data-action=""
  data-button=""
  dir="ltr"
  expand-from="zero"
  icon-name="pie-small"
  name="test"
  role="button"
  tabindex="0"
  type="reset"
  value="value"
>
  Action
</sbb-header-button>
`;
/* end snapshot sbb-header-button renders the component as a button with icon Light DOM */

snapshots["sbb-header-button renders the component as a button with icon Shadow DOM"] = 
`<span class="sbb-action-base sbb-header-button">
  <span class="sbb-header-action__wrapper">
    <span class="sbb-header-action__icon">
      <slot name="icon">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="pie-small"
          role="img"
        >
        </sbb-icon>
      </slot>
    </span>
    <span class="sbb-header-action__text">
      <slot>
      </slot>
    </span>
  </span>
</span>
`;
/* end snapshot sbb-header-button renders the component as a button with icon Shadow DOM */

snapshots["sbb-header-button renders the component as a button with icon A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "a11y label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-header-button renders the component as a button with icon A11y tree Chrome */

snapshots["sbb-header-button renders the component as a button with icon A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "a11y label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-header-button renders the component as a button with icon A11y tree Firefox */

