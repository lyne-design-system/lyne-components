/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-teaser-paid DOM"] = 
`<sbb-teaser-paid
  accessibility-label="label"
  data-action=""
  data-link=""
  dir="ltr"
  href="https://www.sbb.ch"
  rel="external"
  target="_blank"
>
</sbb-teaser-paid>
`;
/* end snapshot sbb-teaser-paid DOM */

snapshots["sbb-teaser-paid Shadow DOM"] = 
`<a
  aria-label="label"
  class="sbb-action-base sbb-teaser-paid"
  href="https://www.sbb.ch"
  rel="external"
  target="_blank"
>
  <slot name="chip">
  </slot>
  <slot name="image">
  </slot>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-teaser-paid Shadow DOM */

snapshots["sbb-teaser-paid A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-teaser-paid A11y tree Chrome */

snapshots["sbb-teaser-paid A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "label",
      "value": "https://www.sbb.ch/"
    }
  ]
}
</p>
`;
/* end snapshot sbb-teaser-paid A11y tree Firefox */

