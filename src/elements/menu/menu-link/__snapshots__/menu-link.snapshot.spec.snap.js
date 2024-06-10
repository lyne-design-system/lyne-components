/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-menu-link renders component with icon and amount Light DOM"] = 
`<sbb-menu-link
  accessibility-label="a11y label"
  amount="123456"
  data-action=""
  data-link=""
  dir="ltr"
  href="https://github.com/sbb-design-systems/lyne-components"
  icon-name="menu-small"
  target="_blank"
>
  <span>
    Action
  </span>
</sbb-menu-link>
`;
/* end snapshot sbb-menu-link renders component with icon and amount Light DOM */

snapshots["sbb-menu-link renders component with icon and amount Shadow DOM"] = 
`<a
  aria-label="a11y label"
  class="sbb-action-base sbb-menu-link"
  href="https://github.com/sbb-design-systems/lyne-components"
  rel="external noopener nofollow"
  target="_blank"
>
  <span class="sbb-menu-action__content">
    <span class="sbb-menu-action__icon">
      <slot name="icon">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="menu-small"
          role="img"
        >
        </sbb-icon>
      </slot>
    </span>
    <span class="sbb-menu-action__label">
      <slot>
      </slot>
    </span>
    <span class="sbb-menu-action__amount">
      123456
    </span>
  </span>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-menu-link renders component with icon and amount Shadow DOM */

snapshots["sbb-menu-link renders component with icon and amount A11y tree Chrome"] = 
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
/* end snapshot sbb-menu-link renders component with icon and amount A11y tree Chrome */

snapshots["sbb-menu-link renders component with icon and amount A11y tree Firefox"] = 
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
/* end snapshot sbb-menu-link renders component with icon and amount A11y tree Firefox */

