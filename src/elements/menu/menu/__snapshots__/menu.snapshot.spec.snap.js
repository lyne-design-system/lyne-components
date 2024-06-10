/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-menu renders DOM"] = 
`<sbb-menu
  data-state="closed"
  id="sbb-menu-0"
  trigger="menu-trigger"
>
  <sbb-block-link
    data-action=""
    data-link=""
    data-sbb-link=""
    data-slot-names="unnamed"
    dir="ltr"
    href="https://www.sbb.ch/en"
    icon-placement="start"
    size="s"
  >
    Profile
  </sbb-block-link>
  <sbb-menu-button
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="tick-small"
    role="button"
    tabindex="0"
  >
    View
  </sbb-menu-button>
  <sbb-menu-button
    amount="1"
    aria-disabled="true"
    data-action=""
    data-button=""
    dir="ltr"
    disabled=""
    icon-name="pen-small"
    role="button"
  >
    Edit
  </sbb-menu-button>
  <sbb-menu-button
    amount="2"
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="swisspass-small"
    role="button"
    tabindex="0"
  >
    Details
  </sbb-menu-button>
  <sbb-divider
    aria-orientation="horizontal"
    orientation="horizontal"
    role="separator"
  >
  </sbb-divider>
  <sbb-menu-button
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="cross-small"
    role="button"
    tabindex="0"
  >
    Cancel
  </sbb-menu-button>
</sbb-menu>
`;
/* end snapshot sbb-menu renders DOM */

snapshots["sbb-menu renders Shadow DOM"] = 
`<div class="sbb-menu__container">
  <div class="sbb-menu">
    <div class="sbb-menu__content">
      <slot>
      </slot>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-menu renders Shadow DOM */

snapshots["sbb-menu renders with list DOM"] = 
`<sbb-menu
  data-state="closed"
  id="sbb-menu-2"
  trigger="menu-trigger"
>
  <sbb-menu-button
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="tick-small"
    role="button"
    slot="li-0"
    tabindex="0"
  >
    View
  </sbb-menu-button>
  <sbb-menu-button
    amount="1"
    aria-disabled="true"
    data-action=""
    data-button=""
    dir="ltr"
    disabled=""
    icon-name="pen-small"
    role="button"
    slot="li-1"
  >
    Edit
  </sbb-menu-button>
  <sbb-menu-button
    amount="2"
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="swisspass-small"
    role="button"
    slot="li-2"
    tabindex="0"
  >
    Details
  </sbb-menu-button>
  <sbb-menu-button
    data-action=""
    data-button=""
    dir="ltr"
    icon-name="cross-small"
    role="button"
    slot="li-3"
    tabindex="0"
  >
    Cancel
  </sbb-menu-button>
</sbb-menu>
`;
/* end snapshot sbb-menu renders with list DOM */

snapshots["sbb-menu renders with list Shadow DOM"] = 
`<div class="sbb-menu__container">
  <div class="sbb-menu">
    <div class="sbb-menu__content">
      <ul class="sbb-menu-list">
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
        <li>
          <slot name="li-3">
          </slot>
        </li>
      </ul>
      <span hidden="">
        <slot>
        </slot>
      </span>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-menu renders with list Shadow DOM */

