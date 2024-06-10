/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-skiplink-list should render named slots if data-ssr-child-count attribute is set"] = 
`<div class="sbb-skiplink-list__wrapper">
  <sbb-title
    aria-level="2"
    class="sbb-link-list-title"
    id="sbb-skiplink-list-title-id"
    level="2"
    negative=""
    role="heading"
    visual-level="5"
    visually-hidden=""
  >
    <slot name="title">
    </slot>
  </sbb-title>
  <ul
    aria-labelledby="sbb-skiplink-list-title-id"
    class="sbb-skiplink-list"
  >
    <li>
      <slot name="li-0">
      </slot>
    </li>
    <li>
      <slot name="li-1">
      </slot>
    </li>
    <li>
      <slot name="li-2">
      </slot>
    </li>
  </ul>
  <span hidden="">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-skiplink-list should render named slots if data-ssr-child-count attribute is set */

snapshots["sbb-skiplink-list renders DOM"] = 
`<sbb-skiplink-list data-slot-names="li-0 li-1 li-2">
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="#"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-0"
  >
    Link 1
  </sbb-block-link>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="#"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-1"
  >
    Link 2
  </sbb-block-link>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="#"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-2"
  >
    Link 3
  </sbb-block-link>
</sbb-skiplink-list>
`;
/* end snapshot sbb-skiplink-list renders DOM */

snapshots["sbb-skiplink-list renders Shadow DOM"] = 
`<div class="sbb-skiplink-list__wrapper">
  <sbb-title
    aria-level="2"
    class="sbb-link-list-title"
    id="sbb-skiplink-list-title-id"
    level="2"
    negative=""
    role="heading"
    visual-level="5"
    visually-hidden=""
  >
    <slot name="title">
    </slot>
  </sbb-title>
  <ul
    aria-labelledby="sbb-skiplink-list-title-id"
    class="sbb-skiplink-list"
  >
    <li>
      <slot name="li-0">
      </slot>
    </li>
    <li>
      <slot name="li-1">
      </slot>
    </li>
    <li>
      <slot name="li-2">
      </slot>
    </li>
  </ul>
  <span hidden="">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-skiplink-list renders Shadow DOM */

snapshots["sbb-skiplink-list renders with title DOM"] = 
`<sbb-skiplink-list
  data-slot-names="li-0 li-1 li-2"
  title-content="Skip to"
  title-level="3"
>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="https://www.sbb.ch"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-0"
  >
    Link 1
  </sbb-block-link>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="https://www.sbb.ch"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-1"
  >
    Link 2
  </sbb-block-link>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="https://www.sbb.ch"
    icon-placement="start"
    negative=""
    size="m"
    slot="li-2"
  >
    Link 3
  </sbb-block-link>
</sbb-skiplink-list>
`;
/* end snapshot sbb-skiplink-list renders with title DOM */

snapshots["sbb-skiplink-list renders with title Shadow DOM"] = 
`<div class="sbb-skiplink-list__wrapper">
  <sbb-title
    aria-level="3"
    class="sbb-link-list-title"
    id="sbb-skiplink-list-title-id"
    level="3"
    negative=""
    role="heading"
    visual-level="5"
    visually-hidden=""
  >
    <slot name="title">
      Skip to
    </slot>
  </sbb-title>
  <ul
    aria-labelledby="sbb-skiplink-list-title-id"
    class="sbb-skiplink-list"
  >
    <li>
      <slot name="li-0">
      </slot>
    </li>
    <li>
      <slot name="li-1">
      </slot>
    </li>
    <li>
      <slot name="li-2">
      </slot>
    </li>
  </ul>
  <span hidden="">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-skiplink-list renders with title Shadow DOM */

snapshots["sbb-skiplink-list renders with title A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Skip to",
      "level": 3
    },
    {
      "role": "link",
      "name": "Link 1"
    },
    {
      "role": "link",
      "name": "Link 2"
    },
    {
      "role": "link",
      "name": "Link 3"
    }
  ]
}
</p>
`;
/* end snapshot sbb-skiplink-list renders with title A11y tree Chrome */

snapshots["sbb-skiplink-list renders with title A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Skip to",
      "level": 3
    },
    {
      "role": "link",
      "name": "Link 1",
      "value": "https://www.sbb.ch/"
    },
    {
      "role": "link",
      "name": "Link 2",
      "value": "https://www.sbb.ch/"
    },
    {
      "role": "link",
      "name": "Link 3",
      "value": "https://www.sbb.ch/"
    }
  ]
}
</p>
`;
/* end snapshot sbb-skiplink-list renders with title A11y tree Firefox */

