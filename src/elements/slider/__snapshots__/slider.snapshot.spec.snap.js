/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-slider should render DOM"] = 
`<sbb-slider
  aria-valuemax="100"
  aria-valuemin="0"
  aria-valuenow="1"
  name=""
  role="slider"
  tabindex="0"
  value="1"
>
</sbb-slider>
`;
/* end snapshot sbb-slider should render DOM */

snapshots["sbb-slider should render Shadow DOM"] = 
`<div class="sbb-slider__height-container">
  <div class="sbb-slider__wrapper">
    <slot name="prefix">
    </slot>
    <div
      class="sbb-slider__container"
      style="--sbb-slider-value-fraction:0.01;"
    >
      <input
        class="sbb-slider__range-input"
        max="100"
        min="0"
        tabindex="-1"
        type="range"
        value="1"
      >
      <div class="sbb-slider__line">
        <div class="sbb-slider__selected-line">
        </div>
      </div>
      <div class="sbb-slider__knob">
      </div>
    </div>
    <slot name="suffix">
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-slider should render Shadow DOM */

snapshots["sbb-slider should render A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "",
      "valuemin": 0,
      "valuemax": 100,
      "orientation": "horizontal",
      "value": 1
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render A11y tree Chrome */

snapshots["sbb-slider should render with properties DOM"] = 
`<sbb-slider
  aria-valuemax="500"
  aria-valuemin="0"
  aria-valuenow="100"
  end-icon="walk-fast-small"
  max="500"
  min="0"
  name=""
  role="slider"
  start-icon="walk-slow-small"
  tabindex="0"
  value="100"
>
</sbb-slider>
`;
/* end snapshot sbb-slider should render with properties DOM */

snapshots["sbb-slider should render with properties Shadow DOM"] = 
`<div class="sbb-slider__height-container">
  <div class="sbb-slider__wrapper">
    <slot name="prefix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-slow-small"
        role="img"
      >
      </sbb-icon>
    </slot>
    <div
      class="sbb-slider__container"
      style="--sbb-slider-value-fraction:0.2;"
    >
      <input
        class="sbb-slider__range-input"
        max="500"
        min="0"
        tabindex="-1"
        type="range"
        value="100"
      >
      <div class="sbb-slider__line">
        <div class="sbb-slider__selected-line">
        </div>
      </div>
      <div class="sbb-slider__knob">
      </div>
    </div>
    <slot name="suffix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-fast-small"
        role="img"
      >
      </sbb-icon>
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-slider should render with properties Shadow DOM */

snapshots["sbb-slider should render with properties A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "",
      "valuemin": 0,
      "valuemax": 500,
      "orientation": "horizontal",
      "value": 100
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render with properties A11y tree Chrome */

snapshots["sbb-slider should render disabled DOM"] = 
`<sbb-slider
  aria-disabled="true"
  aria-valuemax="500"
  aria-valuemin="0"
  aria-valuenow="100"
  disabled=""
  end-icon="walk-fast-small"
  max="500"
  min="0"
  name=""
  role="slider"
  start-icon="walk-slow-small"
  value="100"
>
</sbb-slider>
`;
/* end snapshot sbb-slider should render disabled DOM */

snapshots["sbb-slider should render disabled Shadow DOM"] = 
`<div class="sbb-slider__height-container">
  <div class="sbb-slider__wrapper">
    <slot name="prefix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-slow-small"
        role="img"
      >
      </sbb-icon>
    </slot>
    <div
      class="sbb-slider__container"
      style="--sbb-slider-value-fraction:0.2;"
    >
      <input
        class="sbb-slider__range-input"
        disabled=""
        max="500"
        min="0"
        tabindex="-1"
        type="range"
        value="100"
      >
      <div class="sbb-slider__line">
        <div class="sbb-slider__selected-line">
        </div>
      </div>
      <div class="sbb-slider__knob">
      </div>
    </div>
    <slot name="suffix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-fast-small"
        role="img"
      >
      </sbb-icon>
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-slider should render disabled Shadow DOM */

snapshots["sbb-slider should render disabled A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "",
      "disabled": true,
      "valuemin": 0,
      "valuemax": 500,
      "orientation": "horizontal",
      "value": 100
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render disabled A11y tree Chrome */

snapshots["sbb-slider should render readonly DOM"] = 
`<sbb-slider
  aria-readonly="true"
  aria-valuemax="500"
  aria-valuemin="0"
  aria-valuenow="100"
  end-icon="walk-fast-small"
  max="500"
  min="0"
  name=""
  readonly=""
  role="slider"
  start-icon="walk-slow-small"
  tabindex="0"
  value="100"
>
</sbb-slider>
`;
/* end snapshot sbb-slider should render readonly DOM */

snapshots["sbb-slider should render readonly Shadow DOM"] = 
`<div class="sbb-slider__height-container">
  <div class="sbb-slider__wrapper">
    <slot name="prefix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-slow-small"
        role="img"
      >
      </sbb-icon>
    </slot>
    <div
      class="sbb-slider__container"
      style="--sbb-slider-value-fraction:0.2;"
    >
      <input
        class="sbb-slider__range-input"
        disabled=""
        max="500"
        min="0"
        tabindex="-1"
        type="range"
        value="100"
      >
      <div class="sbb-slider__line">
        <div class="sbb-slider__selected-line">
        </div>
      </div>
      <div class="sbb-slider__knob">
      </div>
    </div>
    <slot name="suffix">
      <sbb-icon
        aria-hidden="true"
        data-namespace="default"
        name="walk-fast-small"
        role="img"
      >
      </sbb-icon>
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-slider should render readonly Shadow DOM */

snapshots["sbb-slider should render readonly A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "",
      "valuemin": 0,
      "valuemax": 500,
      "orientation": "horizontal",
      "value": 100
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render readonly A11y tree Chrome */

snapshots["sbb-slider should render A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "1",
      "value": "1"
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render A11y tree Firefox */

snapshots["sbb-slider should render with properties A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "100",
      "value": "100"
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render with properties A11y tree Firefox */

snapshots["sbb-slider should render disabled A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "100",
      "disabled": true,
      "value": "100"
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render disabled A11y tree Firefox */

snapshots["sbb-slider should render readonly A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "slider",
      "name": "",
      "valuetext": "100",
      "value": "100"
    }
  ]
}
</p>
`;
/* end snapshot sbb-slider should render readonly A11y tree Firefox */

