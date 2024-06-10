The `sbb-secondary-button` component provides the same functionality as a native `<button>`
enhanced with the SBB Design in the 'secondary' variant.

```html
<sbb-secondary-button>Button text</sbb-secondary-button>
```

## Slots

The button text is provided via an unnamed slot; the component can optionally display a `sbb-icon`
at the component start using the `iconName` property or via custom content using the `icon` slot.
At least one is mandatory, so you can have a `sbb-secondary-button` with icon only, text only, or with both.

```html
<sbb-secondary-button icon-name="info"> Button text </sbb-secondary-button>

<sbb-secondary-button>
  <sbb-icon slot="icon" name="info"></sbb-icon>
  Button text
</sbb-secondary-button>

<sbb-secondary-button
  icon-name="info"
  aria-label="Click for more information."
></sbb-secondary-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-secondary-button type="submit" name="tickets" form="buy" value="tickets">
  Buy tickets
</sbb-secondary-button>
```

## Style

The component has a negative variant which can be set using the `negative` property.

There are two different sizes (`m` and `l`, which is the default) that can be set using the `size` property.

The component can be displayed in `disabled` state using the self-named property.

```html
<sbb-secondary-button negative>Button</sbb-secondary-button>

<sbb-secondary-button size="m">Button</sbb-secondary-button>

<sbb-secondary-button disabled>Button</sbb-secondary-button>
```

### Focus outline

Please make sure that the focus outline appears in the correct color if the component is used on a dark background.
You can set it by re-defining the css var on `sbb-secondary-button` or any parent element:

```css
sbb-secondary-button {
  --sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);
}
```

## Accessibility

Use the accessibility properties in case of an icon-only button to describe the purpose of the `sbb-secondary-button` for screen-reader users.

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

| Name   | Description                                                  |
| ------ | ------------------------------------------------------------ |
|        | Use the unnamed slot to add content to the secondary-button. |
| `icon` | Slot used to display the icon, if one is set                 |
