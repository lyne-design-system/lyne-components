/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-train-wagon should render as type wagon DOM"] = 
`<sbb-train-wagon
  blocked-passage="previous"
  data-has-visible-wagon-content=""
  label="38"
  occupancy="none"
  type="wagon"
  wagon-class="1"
>
</sbb-train-wagon>
`;
/* end snapshot sbb-train-wagon should render as type wagon DOM */

snapshots["sbb-train-wagon should render as type wagon Shadow DOM"] = 
`<div class="sbb-train-wagon">
  <ul
    aria-label="Train coach"
    class="sbb-train-wagon__compartment"
  >
    <li
      aria-hidden="false"
      class="sbb-train-wagon__label"
    >
      <span class="sbb-screen-reader-only">
        Number,
      </span>
      38
    </li>
    <li class="sbb-train-wagon__class">
      <span class="sbb-screen-reader-only">
        First Class
      </span>
      <span aria-hidden="true">
        1
      </span>
    </li>
    <sbb-timetable-occupancy-icon
      aria-label="No occupancy forecast available"
      class="sbb-train-wagon__occupancy"
      data-namespace="default"
      role="listitem"
    >
    </sbb-timetable-occupancy-icon>
    <li class="sbb-screen-reader-only">
      No passage to the previous train coach
    </li>
  </ul>
  <span
    class="sbb-train-wagon__icons"
    hidden=""
  >
    <span hidden="">
      <slot>
      </slot>
    </span>
  </span>
</div>
`;
/* end snapshot sbb-train-wagon should render as type wagon Shadow DOM */

snapshots["sbb-train-wagon should render as type wagon A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Number,"
    },
    {
      "role": "text",
      "name": " "
    },
    {
      "role": "text",
      "name": "38"
    },
    {
      "role": "text",
      "name": "First Class"
    },
    {
      "role": "text",
      "name": "No passage to the previous train coach"
    }
  ]
}
</p>
`;
/* end snapshot sbb-train-wagon should render as type wagon A11y tree Chrome */

snapshots["sbb-train-wagon should render as type wagon with one icon DOM"] = 
`<sbb-train-wagon
  data-has-visible-wagon-content=""
  type="wagon"
>
  <sbb-icon
    aria-hidden="true"
    data-namespace="default"
    name="sa-rs"
    role="img"
    slot="li-0"
  >
  </sbb-icon>
</sbb-train-wagon>
`;
/* end snapshot sbb-train-wagon should render as type wagon with one icon DOM */

snapshots["sbb-train-wagon should render as type wagon with one icon Shadow DOM"] = 
`<div class="sbb-train-wagon">
  <ul
    aria-label="Train coach"
    class="sbb-train-wagon__compartment"
  >
    <li
      aria-hidden="true"
      class="sbb-train-wagon__label"
    >
    </li>
    <sbb-timetable-occupancy-icon
      aria-label="No occupancy forecast available"
      class="sbb-train-wagon__occupancy"
      data-namespace="default"
      role="listitem"
    >
    </sbb-timetable-occupancy-icon>
  </ul>
  <span class="sbb-train-wagon__icons">
    <sbb-screen-reader-only>
      Additional wagon information
    </sbb-screen-reader-only>
    <span class="sbb-train-wagon__icons-list">
      <span>
        <slot name="li-0">
        </slot>
      </span>
    </span>
    <span hidden="">
      <slot>
      </slot>
    </span>
  </span>
</div>
`;
/* end snapshot sbb-train-wagon should render as type wagon with one icon Shadow DOM */

snapshots["sbb-train-wagon should render as type wagon with multiple icons DOM"] = 
`<sbb-train-wagon
  data-has-visible-wagon-content=""
  type="wagon"
>
  <sbb-icon
    aria-hidden="true"
    data-namespace="default"
    name="sa-rs"
    role="img"
    slot="li-0"
  >
  </sbb-icon>
  <sbb-icon
    aria-hidden="true"
    data-namespace="default"
    name="sa-rs"
    role="img"
    slot="li-1"
  >
  </sbb-icon>
</sbb-train-wagon>
`;
/* end snapshot sbb-train-wagon should render as type wagon with multiple icons DOM */

snapshots["sbb-train-wagon should render as type wagon with multiple icons Shadow DOM"] = 
`<div class="sbb-train-wagon">
  <ul
    aria-label="Train coach"
    class="sbb-train-wagon__compartment"
  >
    <li
      aria-hidden="true"
      class="sbb-train-wagon__label"
    >
    </li>
    <sbb-timetable-occupancy-icon
      aria-label="No occupancy forecast available"
      class="sbb-train-wagon__occupancy"
      data-namespace="default"
      role="listitem"
    >
    </sbb-timetable-occupancy-icon>
  </ul>
  <span class="sbb-train-wagon__icons">
    <ul
      aria-label="Additional wagon information"
      class="sbb-train-wagon__icons-list"
    >
      <li>
        <slot name="li-0">
        </slot>
      </li>
      <li>
        <slot name="li-1">
        </slot>
      </li>
    </ul>
    <span hidden="">
      <slot>
      </slot>
    </span>
  </span>
</div>
`;
/* end snapshot sbb-train-wagon should render as type wagon with multiple icons Shadow DOM */

snapshots["sbb-train-wagon should render as type locomotive DOM"] = 
`<sbb-train-wagon
  additional-accessibility-text="Top of the train"
  type="locomotive"
>
</sbb-train-wagon>
`;
/* end snapshot sbb-train-wagon should render as type locomotive DOM */

snapshots["sbb-train-wagon should render as type locomotive Shadow DOM"] = 
`<div class="sbb-train-wagon">
  <span class="sbb-train-wagon__compartment">
    <span class="sbb-screen-reader-only">
      Locomotive
    </span>
    <span
      aria-hidden="true"
      class="sbb-train-wagon__label"
    >
    </span>
  </span>
  <span class="sbb-screen-reader-only">
    , Top of the train
  </span>
</div>
`;
/* end snapshot sbb-train-wagon should render as type locomotive Shadow DOM */

snapshots["sbb-train-wagon should render as type closed wagon without number DOM"] = 
`<sbb-train-wagon type="closed">
</sbb-train-wagon>
`;
/* end snapshot sbb-train-wagon should render as type closed wagon without number DOM */

snapshots["sbb-train-wagon should render as type closed wagon without number Shadow DOM"] = 
`<div class="sbb-train-wagon">
  <span class="sbb-train-wagon__compartment">
    <span class="sbb-screen-reader-only">
      Closed train coach
    </span>
    <span
      aria-hidden="true"
      class="sbb-train-wagon__label"
    >
    </span>
  </span>
</div>
`;
/* end snapshot sbb-train-wagon should render as type closed wagon without number Shadow DOM */

snapshots["sbb-train-wagon should render as type wagon A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Number,"
    },
    {
      "role": "text leaf",
      "name": "38"
    },
    {
      "role": "text leaf",
      "name": "First Class"
    },
    {
      "role": "text leaf",
      "name": "No passage to the previous train coach"
    }
  ]
}
</p>
`;
/* end snapshot sbb-train-wagon should render as type wagon A11y tree Firefox */

