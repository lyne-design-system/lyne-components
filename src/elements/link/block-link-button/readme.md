The `sbb-block-link-button` component provides the same functionality as a native `<button>`,
despite its appearance as a link enhanced with the SBB Design.

## Slots

The text is provided via an unnamed slot; the component can optionally display a `sbb-icon` using
the `iconName` property or via custom content using the `icon` slot.
By default, the icon is placed at the component's end, but this can be changed using the `iconPlacement` property.

```html
<sbb-block-link-button value="help"> Help </sbb-block-link-button>

<sbb-block-link-button value="contact" icon-name="chevron-small-left-small" icon-placement="start">
  Contact
</sbb-block-link-button>
```

## States

The component can be displayed in `disabled` state using the self-named property.

```html
<sbb-block-link-button disabled>Refunds</sbb-block-link-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-block-link-button name="tickets" form="buy" value="tickets">
  Travel-cards and tickets
</sbb-block-link-button>
```

## Style

The component has three sizes (`xs`, `s`, which is the default, and `m`).

```html
<sbb-block-link-button size="m">Refunds</sbb-block-link-button>
```

<!-- Auto Generated Below -->

## Properties

| Name            | Attribute        | Privacy | Type                            | Default    | Description                                                                                                                      |
| --------------- | ---------------- | ------- | ------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`      | `disabled`       | public  | `boolean`                       | `false`    | Whether the component is disabled.                                                                                               |
| `form`          | `form`           | public  | `string \| undefined`           |            | The <form> element to associate the button with.                                                                                 |
| `iconName`      | `icon-name`      | public  | `string \| undefined`           |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `iconPlacement` | `icon-placement` | public  | `SbbIconPlacement \| undefined` | `'start'`  | Moves the icon to the end of the component if set to true.                                                                       |
| `name`          | `name`           | public  | `string`                        |            | The name of the button element.                                                                                                  |
| `size`          | `size`           | public  | `SbbLinkSize`                   | `'s'`      | Text size, the link should get in the non-button variation. With inline variant, the text size adapts to where it is used.       |
| `type`          | `type`           | public  | `SbbButtonType`                 | `'button'` | The type attribute to use for the button.                                                                                        |
| `value`         | `value`          | public  | `string`                        |            | The value of the button element.                                                                                                 |

## Slots

| Name   | Description                                                         |
| ------ | ------------------------------------------------------------------- |
|        | Use the unnamed slot to add content to the `sbb-block-link-button`. |
| `icon` | Slot used to display the icon, if one is set.                       |
