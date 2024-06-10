The `sbb-popover-trigger` component is used to trigger a [sbb-popover](/docs/elements-sbb-popover-sbb-popover--docs)
by pressing or hovering on it.

```html
<sbb-popover-trigger id="popover-trigger"></sbb-popover-trigger>

<sbb-popover trigger="popover-trigger">
  <sbb-title level="2" visual-level="6" style="margin-block-start: 0">Popover title.</sbb-title>
  <p>Popover content.</p>
</sbb-popover>
```

## Slots

By default, it renders the `sbb-icon` named `information-circle-small`;
it is possible to define a custom icon with the property `iconName`.
Moreover, it is possible to override the `sbb-icon` with custom content by slotting it.

```html
<sbb-popover-trigger id="popover-trigger" icon-name="pie-small"> </sbb-popover-trigger>

<sbb-popover trigger="popover-trigger">
  <sbb-title level="2" visual-level="6" style="margin-block-start: 0">Popover title.</sbb-title>
  <p>Popover content.</p>
</sbb-popover>

<sbb-popover-trigger id="popover-trigger2"> Custom Content </sbb-popover-trigger>

<sbb-popover trigger="popover-trigger2">
  <sbb-title level="2" visual-level="6" style="margin-block-start: 0">Popover title.</sbb-title>
  <p>Another popover content.</p>
</sbb-popover>
```

## State

It is possible to display the component in `disabled` state by using the self-named properties.

```html
<sbb-popover-trigger id="popover-trigger" disabled></sbb-popover-trigger>

<sbb-popover trigger="popover-trigger">
  <sbb-title level="2" visual-level="6" style="margin-block-start: 0">Popover title.</sbb-title>
  <p>Popover content.</p>
</sbb-popover>
```

## Accessibility

To make screen-readers announce the type of the trigger when is focused,
use the `aria-label` attribute, as shown below:

```html
<sbb-popover-trigger aria-label="Custom label" id="popover-trigger"></sbb-popover-trigger>
```

To make screen-readers announce the popover content when the trigger is focused,
associate the popover trigger with the popover via `aria-describedby` and an `id`.

```html
<sbb-popover-trigger aria-describedby="popover-content" id="popover-trigger"></sbb-popover-trigger>

<!-- Popover component -->
<sbb-popover id="popover" trigger="popover-trigger">
  <sbb-title level="2" visual-level="6" style="margin-block-start: 0">Popover title.</sbb-title>
  <p id="popover-content">Popover content. <sbb-link id="popover-link">Link</sbb-link></p>
</sbb-popover>
```

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute   | Privacy | Type                  | Default    | Description                                                                                                                      |
| ---------- | ----------- | ------- | --------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `disabled`  | public  | `boolean`             | `false`    | Whether the component is disabled.                                                                                               |
| `form`     | `form`      | public  | `string \| undefined` |            | The <form> element to associate the button with.                                                                                 |
| `iconName` | `icon-name` | public  | `string \| undefined` |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `name`     | `name`      | public  | `string`              |            | The name of the button element.                                                                                                  |
| `negative` | `negative`  | public  | `boolean`             | `false`    | Negative coloring variant flag.                                                                                                  |
| `type`     | `type`      | public  | `SbbButtonType`       | `'button'` | The type attribute to use for the button.                                                                                        |
| `value`    | `value`     | public  | `string`              |            | The value of the button element.                                                                                                 |

## Slots

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
|      | Use the unnamed slot to add content to the `sbb-popover-trigger`. |
