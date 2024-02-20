The `sbb-dialog` component provides a way to present content on top of the app's content.
It offers the following features:

- creates a backdrop for disabling interaction below the modal;
- disables scrolling of the page content while open;
- manages focus properly by setting it on the first focusable element;
- can host a [sbb-dialog-actions](/docs/components-sbb-dialog-actions--docs) component in the footer;
- has a close button, which is always visible;
- can display a back button next to the title;
- adds the appropriate ARIA roles automatically.

```html
<sbb-dialog>
  <sbb-dialog-title>Title</sbb-dialog-title>
  <sbb-dialog-content>Dialog content.</sbb-dialog-content>
</sbb-dialog>
```

## Slots

There are three slots: `title`, `content` and `actions`, which can respectively be used to provide an `sbb-dialog-title`, `sbb-dialog-content` and an `sbb-dialog-actions`.

**NOTE:**
It's not necessary to set the slots explicitly on the dialog's inner components, as they already have an implicit slot name.

```html
<sbb-dialog>
  <sbb-dialog-title>Title</sbb-dialog-title>
  <sbb-dialog-content>Dialog content.</sbb-dialog-content>
  <sbb-dialog-action>
    <sbb-link sbb-dialog-close>Link</sbb-link>
    <sbb-button variant="secondary" sbb-dialog-close> Cancel </sbb-button>
    <sbb-button variant="primary" sbb-dialog-close> Confirm </sbb-button>
  </sbb-dialog-actions>
</sbb-dialog>
```

## Interactions

In order to show the dialog, you need to call the `open(event?: PointerEvent)` method on the `sbb-dialog` component.
It is necessary to pass the event object to the `open()` method to allow the dialog to detect
whether it has been opened by click or keyboard, so that the focus can be better handled.

```html
<sbb-button label="Open dialog" click="openDialog(event, 'my-dialog')"></sbb-button>

<sbb-dialog id="my-dialog">
  <sbb-dialog-title>Title</sbb-dialog-title>
  <sbb-dialog-content>Dialog content.</sbb-dialog-content>
</sbb-dialog>

<script>
  const openDialog = (event, id) => {
    const dialog = document.getElementById(id);
    dialog.open(event);
  };
</script>
```

To dismiss the dialog, you need to get a reference to the `sbb-dialog` element and call
the `close(result?: any, target?: HTMLElement)` method, which will close the dialog element and
emit a close event with an optional result as a payload.

The component can also be dismissed by clicking on the close button, clicking on the backdrop, pressing the `Esc` key,
or, if an element within the `sbb-dialog` has the `sbb-dialog-close` attribute, by clicking on it.

You can also set the property `backButton` on the `sbb-dialog-title` component to display the back button in the title section which will emit the event `requestBackAction` when clicked.

## Style

It's possible to display the component in `negative` variant using the self-named property.

```html
<sbb-dialog negative>
  <sbb-dialog-title>Title</sbb-dialog-title>
  <sbb-dialog-content>Dialog content.</sbb-dialog-content>
</sbb-dialog>
```

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute             | Privacy | Type                  | Default   | Description                                                          |
| -------------------- | --------------------- | ------- | --------------------- | --------- | -------------------------------------------------------------------- |
| `backdropAction`     | `backdrop-action`     | public  | `'close' \| 'none'`   | `'close'` | Backdrop click action.                                               |
| `negative`           | `negative`            | public  | `boolean`             | `false`   | Negative coloring variant flag.                                      |
| `accessibilityLabel` | `accessibility-label` | public  | `string \| undefined` |           | This will be forwarded as aria-label to the relevant nested element. |
| `disableAnimation`   | `disable-animation`   | public  | `boolean`             | `false`   | Whether the animation is enabled.                                    |

## Methods

| Name    | Privacy | Description                | Parameters                         | Return | Inherited From |
| ------- | ------- | -------------------------- | ---------------------------------- | ------ | -------------- |
| `open`  | public  | Opens the dialog element.  |                                    | `void` |                |
| `close` | public  | Closes the dialog element. | `result: any, target: HTMLElement` | `any`  |                |

## Events

| Name        | Type                | Description                                                                     | Inherited From |
| ----------- | ------------------- | ------------------------------------------------------------------------------- | -------------- |
| `willOpen`  | `CustomEvent<void>` | Emits whenever the `sbb-dialog` starts the opening transition. Can be canceled. |                |
| `didOpen`   | `CustomEvent<void>` | Emits whenever the `sbb-dialog` is opened.                                      |                |
| `willClose` | `CustomEvent<void>` | Emits whenever the `sbb-dialog` begins the closing transition. Can be canceled. |                |
| `didClose`  | `CustomEvent<void>` | Emits whenever the `sbb-dialog` is closed.                                      |                |

## CSS Properties

| Name                   | Default                      | Description                                                                                                                                                                                           |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sbb-dialog-z-index` | `var(--sbb-overlay-z-index)` | To specify a custom stack order, the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the component is set to `var(--sbb-overlay-z-index)` with a value of `1000`. |

## Slots

| Name      | Description                                      |
| --------- | ------------------------------------------------ |
| `title`   | Use this slot to provide a `sbb-dialog-title`.   |
| `content` | Use this slot to provide a `sbb-dialog-content`. |
| `actions` | Use this slot to provide a `sbb-dialog-actions`. |
