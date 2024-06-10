/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-header-link renders the component as a button with icon Light DOM"] = 
`<sbb-header-link
  accessibility-label="a11y label"
  data-action=""
  data-link=""
  dir="ltr"
  expand-from="small"
  href="https://github.com/sbb-design-systems/lyne-components"
  icon-name="pie-small"
  target="_blank"
>
  Action
</sbb-header-link>
`;
/* end snapshot sbb-header-link renders the component as a button with icon Light DOM */

snapshots["sbb-header-link renders the component as a button with icon Shadow DOM"] = 
`<a
  aria-label="a11y label"
  class="sbb-action-base sbb-header-link"
  href="https://github.com/sbb-design-systems/lyne-components"
  rel="external noopener nofollow"
  target="_blank"
>
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
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-header-link renders the component as a button with icon Shadow DOM */

snapshots["sbb-header-link renders the component as a button with icon A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "a11y label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-header-link renders the component as a button with icon A11y tree Chrome */

snapshots["sbb-header-link renders the component as a button with icon A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "a11y label",
      "value": "https://github.com/sbb-design-systems/lyne-components"
    }
  ]
}
</p>
`;
/* end snapshot sbb-header-link renders the component as a button with icon A11y tree Firefox */

