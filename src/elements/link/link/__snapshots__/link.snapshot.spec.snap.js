/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-link renders - DOM"] = 
`<sbb-link
  data-action=""
  data-link=""
  data-sbb-link=""
  data-slot-names="unnamed"
  dir="ltr"
  href="https://sbb.ch"
  size="m"
  target="_blank"
>
  Travelcards & tickets.
</sbb-link>
`;
/* end snapshot sbb-link renders - DOM */

snapshots["sbb-link renders - Shadow DOM"] = 
`<a
  class="sbb-action-base sbb-link"
  href="https://sbb.ch"
  rel="external noopener nofollow"
  target="_blank"
>
  <slot>
  </slot>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-link renders - Shadow DOM */

snapshots["sbb-link A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Travelcards & tickets. . Link target opens in a new window."
    }
  ]
}
</p>
`;
/* end snapshot sbb-link A11y tree Chrome */

snapshots["sbb-link A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Travelcards & tickets. . Link target opens in a new window.",
      "value": "https://sbb.ch/"
    }
  ]
}
</p>
`;
/* end snapshot sbb-link A11y tree Firefox */

