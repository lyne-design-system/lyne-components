The component represents a button element contained by the [sbb-header](/docs/elements-sbb-header-sbb-header--docs) component.

## Slots

It is possible to provide a label via an unnamed slot; the component can optionally display a `sbb-icon`
at the component start using the `iconName` property or via custom content using the `icon` slot.

```html
<sbb-header-button>Text</sbb-header-button>

<sbb-header-button icon-name="pie-small">Another text</sbb-header-button>
```

If the component's icon is set, the property `expandFrom` can be used to define the minimum breakpoint
from which the label is displayed; below that, only the icon is visible.

```html
<sbb-header-button expand-from="medium">Text</sbb-header-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-header-button value="menu" name="menu">Button</sbb-header-button>
```

<!-- Auto Generated Below -->

## Properties

| Name         | Attribute     | Privacy | Type                  | Default    | Description                                                                                                                                                                              |
| ------------ | ------------- | ------- | --------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expandFrom` | `expand-from` | public  | `SbbHorizontalFrom`   | `'medium'` | Used to set the minimum breakpoint from which the text is displayed. E.g. if set to 'large', the text will be visible for breakpoints large, wide, ultra, and hidden for all the others. |
| `form`       | `form`        | public  | `string \| undefined` |            | The <form> element to associate the button with.                                                                                                                                         |
| `iconName`   | `icon-name`   | public  | `string \| undefined` |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch.                                                         |
| `name`       | `name`        | public  | `string`              |            | The name of the button element.                                                                                                                                                          |
| `type`       | `type`        | public  | `SbbButtonType`       | `'button'` | The type attribute to use for the button.                                                                                                                                                |
| `value`      | `value`       | public  | `string`              |            | The value of the button element.                                                                                                                                                         |

## Slots

| Name   | Description                                                     |
| ------ | --------------------------------------------------------------- |
|        | Use the unnamed slot to add content to the `sbb-header-button`. |
| `icon` | Slot used to render the button icon.                            |
