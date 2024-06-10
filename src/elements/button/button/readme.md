The `sbb-button` component provides the same functionality as a native `<button>`
enhanced with the SBB Design in the 'primary' variant.

```html
<sbb-button>Button text</sbb-button>
```

## Slots

The button text is provided via an unnamed slot; the component can optionally display a `sbb-icon`
at the component start using the `iconName` property or via custom content using the `icon` slot.
At least one is mandatory, so you can have a `sbb-button` with icon only, text only, or with both.

```html
<sbb-button icon-name="info"> Button text </sbb-button>

<sbb-button>
  <sbb-icon slot="icon" name="info"></sbb-icon>
  Button text
</sbb-button>

<sbb-button icon-name="info" aria-label="Click for more information."></sbb-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-button type="submit" name="tickets" form="buy" value="tickets"> Buy tickets </sbb-button>
```

## Style

The component has a negative variant which can be set using the `negative` property.

There are two different sizes (`m` and `l`, which is the default) that can be set using the `size` property.

The component can be displayed in `disabled` state using the self-named property.

```html
<sbb-button negative>Button</sbb-button>

<sbb-button size="m">Button</sbb-button>

<sbb-button disabled>Button</sbb-button>
```

### Focus outline

Please make sure that the focus outline appears in the correct color if the component is used on a dark background.
You can set it by re-defining the css var on `sbb-button` or any parent element:

```css
sbb-button {
  --sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);
}
```

## Accessibility

Use the accessibility properties in case of an icon-only button to describe the purpose of the `sbb-button` for screen-reader users.

<!-- Auto Generated Below -->

## Properties

| Name       | Attribute   | Privacy | Type                         | Default    | Description                                                                                                                      |
| ---------- | ----------- | ------- | ---------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `disabled`  | public  | `boolean`                    | `false`    | Whether the component is disabled.                                                                                               |
| `form`     | `form`      | public  | `string \| undefined`        |            | The <form> element to associate the button with.                                                                                 |
| `iconName` | `icon-name` | public  | `string \| undefined`        |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `name`     | `name`      | public  | `string`                     |            | The name of the button element.                                                                                                  |
| `negative` | `negative`  | public  | `boolean`                    | `false`    | Negative coloring variant flag.                                                                                                  |
| `size`     | `size`      | public  | `SbbButtonSize \| undefined` | `'l'`      | Size variant, either l or m.                                                                                                     |
| `type`     | `type`      | public  | `SbbButtonType`              | `'button'` | The type attribute to use for the button.                                                                                        |
| `value`    | `value`     | public  | `string`                     |            | The value of the button element.                                                                                                 |

## Slots

| Name   | Description                                        |
| ------ | -------------------------------------------------- |
|        | Use the unnamed slot to add content to the button. |
| `icon` | Slot used to display the icon, if one is set       |
