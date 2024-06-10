/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-transparent-button-link renders a sbb-transparent-button-link without icon DOM"] = 
`<sbb-transparent-button-link
  data-action=""
  data-link=""
  data-sbb-button=""
  data-slot-names="unnamed"
  dir="ltr"
  download=""
  href="https://www.sbb.ch"
  rel="noopener"
  size="m"
  target="_blank"
>
  Label Text
</sbb-transparent-button-link>
`;
/* end snapshot sbb-transparent-button-link renders a sbb-transparent-button-link without icon DOM */

snapshots["sbb-transparent-button-link renders a sbb-transparent-button-link without icon Shadow DOM"] = 
`<a
  class="sbb-action-base sbb-transparent-button-link"
  download=""
  href="https://www.sbb.ch"
  rel="noopener"
  target="_blank"
>
  <slot name="icon">
  </slot>
  <span class="sbb-button__label">
    <slot>
    </slot>
  </span>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-transparent-button-link renders a sbb-transparent-button-link without icon Shadow DOM */

snapshots["sbb-transparent-button-link renders a sbb-transparent-button-link without icon A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Label Text . Link target opens in a new window."
    }
  ]
}
</p>
`;
/* end snapshot sbb-transparent-button-link renders a sbb-transparent-button-link without icon A11y tree Chrome */

snapshots["sbb-transparent-button-link renders a disabled sbb-transparent-button-link with slotted icon DOM"] = 
`<sbb-transparent-button-link
  data-action=""
  data-link=""
  data-sbb-button=""
  data-slot-names="icon unnamed"
  dir="ltr"
  disabled=""
  href="https://www.sbb.ch"
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
</sbb-transparent-button-link>
`;
/* end snapshot sbb-transparent-button-link renders a disabled sbb-transparent-button-link with slotted icon DOM */

snapshots["sbb-transparent-button-link renders a disabled sbb-transparent-button-link with slotted icon Shadow DOM"] = 
`<a
  aria-disabled="true"
  class="sbb-action-base sbb-transparent-button-link"
  href="https://www.sbb.ch"
  tabindex="-1"
>
  <slot name="icon">
  </slot>
  <span class="sbb-button__label">
    <slot>
    </slot>
  </span>
</a>
`;
/* end snapshot sbb-transparent-button-link renders a disabled sbb-transparent-button-link with slotted icon Shadow DOM */

snapshots["sbb-transparent-button-link renders a sbb-transparent-button-link without icon A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Label Text . Link target opens in a new window.",
      "value": "https://www.sbb.ch/"
    }
  ]
}
</p>
`;
/* end snapshot sbb-transparent-button-link renders a sbb-transparent-button-link without icon A11y tree Firefox */

