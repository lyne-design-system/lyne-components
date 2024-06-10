/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-timetable-occupancy renders DOM"] = 
`<sbb-timetable-occupancy
  first-class-occupancy="high"
  second-class-occupancy="high"
>
</sbb-timetable-occupancy>
`;
/* end snapshot sbb-timetable-occupancy renders DOM */

snapshots["sbb-timetable-occupancy renders Shadow DOM"] = 
`<ul class="sbb-timetable-occupancy__list">
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      1.
    </span>
    <sbb-screen-reader-only>
      First Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="Very high occupancy expected"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      2.
    </span>
    <sbb-screen-reader-only>
      Second Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="Very high occupancy expected"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
</ul>
`;
/* end snapshot sbb-timetable-occupancy renders Shadow DOM */

snapshots["sbb-timetable-occupancy renders A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "First Class."
    },
    {
      "role": "text",
      "name": "Second Class."
    }
  ]
}
</p>
`;
/* end snapshot sbb-timetable-occupancy renders A11y tree Chrome */

snapshots["sbb-timetable-occupancy renders negative DOM"] = 
`<sbb-timetable-occupancy
  first-class-occupancy="low"
  negative=""
  second-class-occupancy="medium"
>
</sbb-timetable-occupancy>
`;
/* end snapshot sbb-timetable-occupancy renders negative DOM */

snapshots["sbb-timetable-occupancy renders negative Shadow DOM"] = 
`<ul class="sbb-timetable-occupancy__list">
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      1.
    </span>
    <sbb-screen-reader-only>
      First Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="Low to medium occupancy expected"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      negative=""
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      2.
    </span>
    <sbb-screen-reader-only>
      Second Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="High occupancy expected"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      negative=""
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
</ul>
`;
/* end snapshot sbb-timetable-occupancy renders negative Shadow DOM */

snapshots["sbb-timetable-occupancy renders only first class wagon DOM"] = 
`<sbb-timetable-occupancy first-class-occupancy="low">
</sbb-timetable-occupancy>
`;
/* end snapshot sbb-timetable-occupancy renders only first class wagon DOM */

snapshots["sbb-timetable-occupancy renders only first class wagon Shadow DOM"] = 
`<ul
  class="sbb-timetable-occupancy__list"
  role="presentation"
>
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      1.
    </span>
    <sbb-screen-reader-only>
      First Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="Low to medium occupancy expected"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
</ul>
`;
/* end snapshot sbb-timetable-occupancy renders only first class wagon Shadow DOM */

snapshots["sbb-timetable-occupancy renders only second class wagon DOM"] = 
`<sbb-timetable-occupancy second-class-occupancy="none">
</sbb-timetable-occupancy>
`;
/* end snapshot sbb-timetable-occupancy renders only second class wagon DOM */

snapshots["sbb-timetable-occupancy renders only second class wagon Shadow DOM"] = 
`<ul
  class="sbb-timetable-occupancy__list"
  role="presentation"
>
  <li class="sbb-timetable-occupancy__list-item">
    <span
      aria-hidden="true"
      class="sbb-timetable-occupancy__list-item-class"
    >
      2.
    </span>
    <sbb-screen-reader-only>
      Second Class.
    </sbb-screen-reader-only>
    <sbb-timetable-occupancy-icon
      aria-label="No occupancy forecast available"
      class="sbb-timetable-occupancy__list-item-icon"
      data-namespace="default"
      role="img"
    >
    </sbb-timetable-occupancy-icon>
  </li>
</ul>
`;
/* end snapshot sbb-timetable-occupancy renders only second class wagon Shadow DOM */

snapshots["sbb-timetable-occupancy renders A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "First Class."
    },
    {
      "role": "img",
      "name": "Very high occupancy expected"
    },
    {
      "role": "text leaf",
      "name": "Second Class."
    },
    {
      "role": "img",
      "name": "Very high occupancy expected"
    }
  ]
}
</p>
`;
/* end snapshot sbb-timetable-occupancy renders A11y tree Firefox */

