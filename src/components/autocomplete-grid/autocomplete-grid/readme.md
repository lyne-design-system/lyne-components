> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-autocomplete-grid` is a component . . .

```html
<sbb-autocomplete-grid></sbb-autocomplete-grid>
```

## Slots

> Describe slot naming and usage and provide an example of slotted content.

## States

> Describe the component states (`disabled`, `readonly`, etc.) and provide examples.

## Style

> Describe the properties which change the component visualization (`size`, `negative`, etc.) and provide examples.

## Interactions

> Describe how it's possible to interact with the component (open and close a `sbb-dialog`, dismiss a `sbb-alert`, etc.) and provide examples.

## Events

> Describe events triggered by the component and possibly how to get information from the payload.

## Keyboard interaction

> If the component has logic for keyboard navigation (as the `sbb-calendar` or the `sbb-select`) describe it.

| Keyboard       | Action        |
| -------------- | ------------- |
| <kbd>Key</kbd> | What it does. |

## Accessibility

> Describe how accessibility is implemented and if there are issues or suggested best-practice for the consumers.

<!-- Auto Generated Below -->

## Properties

| Name                | Attribute             | Privacy | Type                                      | Default | Description                                                                                                                                                                                                                                                                                                       |
| ------------------- | --------------------- | ------- | ----------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origin`            | `origin`              | public  | `string \| HTMLElement \| undefined`      |         | The element where the autocomplete will attach; accepts both an element's id or an HTMLElement. If not set, will search for the first 'sbb-form-field' ancestor.                                                                                                                                                  |
| `trigger`           | `trigger`             | public  | `string \| HTMLInputElement \| undefined` |         | The input element that will trigger the autocomplete opening; accepts both an element's id or an HTMLElement. By default, the autocomplete will open on focus, click, input or `ArrowDown` keypress of the 'trigger' element. If not set, will search for the first 'input' child of a 'sbb-form-field' ancestor. |
| `disableAnimation`  | `disable-animation`   | public  | `boolean`                                 | `false` | Whether the animation is disabled.                                                                                                                                                                                                                                                                                |
| `preserveIconSpace` | `preserve-icon-space` | public  | `boolean \| undefined`                    |         | Whether the icon space is preserved when no icon is set.                                                                                                                                                                                                                                                          |
| `originElement`     | -                     | public  | `HTMLElement`                             |         | Returns the element where autocomplete overlay is attached to.                                                                                                                                                                                                                                                    |
| `triggerElement`    | -                     | public  | `HTMLInputElement \| undefined`           |         | Returns the trigger element.                                                                                                                                                                                                                                                                                      |
| `negative`          | `negative`            | public  | `boolean`                                 | `false` | Negative coloring variant flag.                                                                                                                                                                                                                                                                                   |

## Methods

| Name    | Privacy | Description              | Parameters | Return | Inherited From |
| ------- | ------- | ------------------------ | ---------- | ------ | -------------- |
| `open`  | public  | Opens the autocomplete.  |            | `void` |                |
| `close` | public  | Closes the autocomplete. |            | `void` |                |

## Events

| Name        | Type                | Description                                                                           | Inherited From |
| ----------- | ------------------- | ------------------------------------------------------------------------------------- | -------------- |
| `willOpen`  | `CustomEvent<void>` | Emits whenever the `sbb-autocomplete` starts the opening transition. Can be canceled. |                |
| `didOpen`   | `CustomEvent<void>` | Emits whenever the `sbb-autocomplete` is opened.                                      |                |
| `willClose` | `CustomEvent<void>` | Emits whenever the `sbb-autocomplete` begins the closing transition. Can be canceled. |                |
| `didClose`  | `CustomEvent<void>` | Emits whenever the `sbb-autocomplete` is closed.                                      |                |

## CSS Properties

| Name                         | Default                      | Description                                                                                                                                                                                           |
| ---------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sbb-autocomplete-z-index` | `var(--sbb-overlay-z-index)` | To specify a custom stack order, the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the component is set to `var(--sbb-overlay-z-index)` with a value of `1000`. |

## Slots

| Name | Description                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------- |
|      | Use the unnamed slot to add `sbb-option` or `sbb-optgroup` elements to the `sbb-autocomplete`. |
