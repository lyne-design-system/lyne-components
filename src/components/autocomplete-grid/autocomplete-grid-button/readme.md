The `sbb-autocomplete-grid-button` component provides the same functionality as a native icon-only `<button>` enhanced with the SBB Design.
It's mainly designed to be used within the [sbb-autocomplete-grid-actions](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-actions--docs)
inside a [sbb-autocomplete-grid](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid--docs).

```html
<sbb-form-field label="Label">
  <input />
  <sbb-autocomplete-grid>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-actions>
        <sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-actions>
    </sbb-autocomplete-grid-row>
    <sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-option value="2">Option 2</sbb-autocomplete-grid-option>
      <sbb-autocomplete-grid-actions>
        <sbb-autocomplete-grid-button icon-name="trash-small"></sbb-autocomplete-grid-button>
      </sbb-autocomplete-grid-actions>
    </sbb-autocomplete-grid-row>
  </sbb-autocomplete-grid>
</sbb-form-field>
```

## Slots

The component can display a `sbb-icon` using the `iconName` property or via custom content using the `icon` slot.

```html
<sbb-autocomplete-grid-button icon-name="pen-small"></sbb-autocomplete-grid-button>

<sbb-autocomplete-grid-button>
  <sbb-icon slot="icon" name="info"></sbb-icon>
</sbb-autocomplete-grid-button>
```

## Button properties

The component is internally rendered as a button,
accepting its associated properties (`type`, `name`, `value` and `form`).

```html
<sbb-autocomplete-grid-button
  icon-name="coins-small"
  type="button"
  name="tickets"
  form="buy"
  value="tickets"
>
</sbb-autocomplete-grid-button>
```

## Style

The component has a negative variant which can be set using the `negative` property.

The component can be displayed in `disabled` state using the self-named property.

```html
<sbb-autocomplete-grid-button icon-name="pen-small" negative></sbb-autocomplete-grid-button>

<sbb-autocomplete-grid-button icon-name="pen-small" disabled></sbb-autocomplete-grid-button>
```

If the component is used within a [sbb-autocomplete-grid-optgroup](/docs/components-sbb-autocomplete-grid-sbb-autocomplete-grid-optgroup--docs),
it can be disabled by disabling the optgroup.

### Focus outline

Please make sure that the focus outline appears in the correct color if the component is used on a dark background.
You can set it by re-defining the css var on `sbb-autocomplete-grid-button` or any parent element:

```css
sbb-autocomplete-grid-button {
  --sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);
}
```

## Interactions

When the button is clicked, an event is triggered; the behavior is up to the consumer.
It's possible to fetch the button's related `sbb-autocomplete-grid-option` using the `optionOnSameRow` method.

## Accessibility

The `sbb-autocomplete-grid` follows the combobox `grid` pattern;
this means that the `sbb-autocomplete-grid-button` has a `button` role and its `id` is set based on the `sbb-autocomplete-grid-actions`'s `id`,
which is needed to correctly set the `aria-activedescendant` on the related `input`.
Moreover, the `sbb-autocomplete-grid-button` can't be focused via <kbd>Tab</kbd> due to the used pattern,
since the focus must always stay on the connected `<input>`.

<!-- Auto Generated Below -->

## Properties

| Name              | Attribute   | Privacy | Type                                       | Default    | Description                                                                                                                      |
| ----------------- | ----------- | ------- | ------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `optionOnSameRow` | -           | public  | `SbbAutocompleteGridOptionElement \| null` |            | Gets the SbbAutocompleteGridOptionElement on the same row of the button.                                                         |
| `disabled`        | `disabled`  | public  | `boolean`                                  | `false`    | Whether the component is disabled.                                                                                               |
| `negative`        | `negative`  | public  | `boolean`                                  | `false`    | Negative coloring variant flag.                                                                                                  |
| `iconName`        | `icon-name` | public  | `string \| undefined`                      |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `type`            | `type`      | public  | `SbbButtonType`                            | `'button'` | The type attribute to use for the button.                                                                                        |
| `name`            | `name`      | public  | `string`                                   |            | The name of the button element.                                                                                                  |
| `value`           | `value`     | public  | `string`                                   |            | The value of the button element.                                                                                                 |
| `form`            | `form`      | public  | `string \| undefined`                      |            | The <form> element to associate the button with.                                                                                 |

## Methods

| Name            | Privacy | Description | Parameters             | Return | Inherited From |
| --------------- | ------- | ----------- | ---------------------- | ------ | -------------- |
| `dispatchClick` | public  |             | `event: KeyboardEvent` | `void` |                |

## Events

| Name    | Type           | Description | Inherited From |
| ------- | -------------- | ----------- | -------------- |
| `click` | `PointerEvent` |             |                |

## Slots

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| `icon` | Slot used to display the icon, if one is set |
