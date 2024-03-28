The `sbb-mini-button` component provides the same functionality as a native icon-only `<button>` enhanced with the SBB Design.
It's mainly designed to be used within the [sbb-form-field](/docs/components-sbb-form-field-sbb-form-field--docs)
in the `prefix` or `suffix` slot.

```html
<sbb-mini-button icon-name="pen-small"></sbb-mini-button>

<sbb-form-field>
  <input />
  <sbb-mini-button slot="prefix" icon-name="pen-small"></sbb-mini-button>
</sbb-form-field>
```

## Slots

The component can display a `sbb-icon` using the `iconName` property or via custom content using the `icon` slot.

```html
<sbb-mini-button icon-name="info" aria-label="Click for more information."></sbb-mini-button>

<sbb-mini-button aria-label="Click for more information.">
  <sbb-icon slot="icon" name="info"></sbb-icon>
</sbb-mini-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-form-field>
  <label>Tickets</label>
  <input placeholder="Insert the number of tickets you want to purchase." />
  <sbb-mini-button
    slot="suffix"
    icon-name="coins-small"
    type="button"
    name="tickets"
    form="buy"
    value="tickets"
  ></sbb-mini-button>
</sbb-form-field>
```

## Style

The component has a negative variant which can be set using the `negative` property.

The component can be displayed in `disabled` state using the self-named property.

```html
<sbb-mini-button icon-name="pie-small" negative></sbb-mini-button>

<sbb-mini-button icon-name="pie-small" disabled></sbb-mini-button>
```

### Focus outline

Please make sure that the focus outline appears in the correct color if the component is used on a dark background.
You can set it by re-defining the css var on `sbb-mini-button` or any parent element:

```css
sbb-mini-button {
  --sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);
}
```

## Accessibility

Use the accessibility properties to describe the purpose of the `sbb-mini-button` for screen-reader users.

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute   | Privacy | Type                  | Default    | Description                                                                                                                      |
| ---------- | ----------- | ------- | --------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `disabled`  | public  | `boolean`             | `false`    | Whether the component is disabled.                                                                                               |
| `negative` | `negative`  | public  | `boolean`             | `false`    | Negative coloring variant flag.                                                                                                  |
| `iconName` | `icon-name` | public  | `string \| undefined` |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `type`     | `type`      | public  | `SbbButtonType`       | `'button'` | The type attribute to use for the button.                                                                                        |
| `name`     | `name`      | public  | `string`              |            | The name of the button element.                                                                                                  |
| `value`    | `value`     | public  | `string`              |            | The value of the button element.                                                                                                 |
| `form`     | `form`      | public  | `string \| undefined` |            | The <form> element to associate the button with.                                                                                 |

## Slots

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| `icon` | Slot used to display the icon, if one is set |
