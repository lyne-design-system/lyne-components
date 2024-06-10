/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-navigation-link renders DOM"] = 
`<sbb-navigation-link
  accessibility-label="a11y label"
  data-action=""
  data-link=""
  dir="ltr"
  href="https://www.sbb.ch"
  size="l"
  target="_blank"
>
  This is a link
</sbb-navigation-link>
`;
/* end snapshot sbb-navigation-link renders DOM */

snapshots["sbb-navigation-link renders Shadow DOM"] = 
`<a
  aria-label="a11y label"
  class="sbb-action-base sbb-navigation-link"
  href="https://www.sbb.ch"
  rel="external noopener nofollow"
  target="_blank"
>
  <sbb-icon
    aria-hidden="true"
    data-namespace="default"
    name="dash-small"
    role="img"
  >
  </sbb-icon>
  <slot>
  </slot>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-navigation-link renders Shadow DOM */

snapshots["sbb-navigation-link renders A11y tree Chrome"] = 
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
/* end snapshot sbb-navigation-link renders A11y tree Chrome */

snapshots["sbb-navigation-link renders A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "a11y label",
      "value": "https://www.sbb.ch/"
    }
  ]
}
</p>
`;
/* end snapshot sbb-navigation-link renders A11y tree Firefox */

