The `sbb-dialog` component provides a way to present content on top of the app's content.
It offers the following features:

- creates a backdrop for disabling interaction below the modal;
- disables scrolling of the page content while open;
- manages focus properly by setting it on the first focusable element;
- can have a header and a footer, both of which are optional;
- can host a [sbb-action-group](/docs/components-sbb-action-group--docs) component in the footer;
- has a close button, which is always visible;
- can display a back button next to the title;
- adds the appropriate ARIA roles automatically.

```html
<sbb-dialog> Dialog content. </sbb-dialog>
```

## Slots

The content is projected in an unnamed slot, while the dialog's title can be provided via the `titleContent` property or via slot `name="title"`.
It's also possible to display buttons in the component's footer using the `action-group` slot with the `sbb-action-group` component.

**NOTE**:

- The component will automatically set size `m` on slotted `sbb-action-group`;
- If the title is not present, the footer will not be displayed even if provided;
- If the title is not present, the dialog will be displayed in fullscreen mode with the close button in the content section along with the back button
  (if visible, see [next paragraph](#interactions)).

```html
<sbb-dialog title-content="Title"> Dialog content. </sbb-dialog>

<sbb-dialog>
  <span slot="title"> My dialog title </span>
  Dialog content.
  <sbb-action-group slot="action-group">
    <sbb-button sbb-dialog-close>Abort</sbb-button>
    <sbb-button>Confirm</sbb-button>
  </sbb-action-group>
</sbb-dialog>
```

## Interactions

In order to show the dialog, you need to call the `open(event?: PointerEvent)` method on the `sbb-dialog` component.
It is necessary to pass the event object to the `open()` method to allow the dialog to detect
whether it has been opened by click or keyboard, so that the focus can be better handled.

```html
<sbb-button label="Open dialog" click="openDialog(event, 'my-dialog')"></sbb-button>
<sbb-dialog id="my-dialog" title-content="Title" title-back-button="true">
  Dialog content.
  <div slot="action-group">...</div>
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

You can also set the property `titleBackButton` to display the back button in the title section
(or content section, if title is omitted) which will emit the event `requestBackAction` when clicked.

## Style

It's possible to display the component in `negative` variant using the self-named property.

## Animation

Add the `sbb-disable-animation` class to disable animation and transition effects for the element and all its children.

<!-- Auto Generated Below -->

## Properties

| Name                      | Attribute                   | Privacy | Type                         | Default   | Description                                                                     |
| ------------------------- | --------------------------- | ------- | ---------------------------- | --------- | ------------------------------------------------------------------------------- |
| `titleContent`            | `title-content`             | public  | `string \| undefined`        |           | Dialog title.                                                                   |
| `titleLevel`              | `title-level`               | public  | `SbbTitleLevel`              | `'1'`     | Level of title, will be rendered as heading tag (e.g. h1). Defaults to level 1. |
| `titleBackButton`         | `title-back-button`         | public  | `boolean`                    | `false`   | Whether a back button is displayed next to the title.                           |
| `backdropAction`          | `backdrop-action`           | public  | `'close' \| 'none'`          | `'close'` | Backdrop click action.                                                          |
| `accessibilityLabel`      | `accessibility-label`       | public  | `string \| undefined`        |           | This will be forwarded as aria-label to the relevant nested element.            |
| `accessibilityCloseLabel` | `accessibility-close-label` | public  | `\| string     \| undefined` |           | This will be forwarded as aria-label to the close button element.               |
| `accessibilityBackLabel`  | `accessibility-back-label`  | public  | `\| string     \| undefined` |           | This will be forwarded as aria-label to the back button element.                |
| `negative`                | `negative`                  | public  | `boolean`                    | `false`   | Negative coloring variant flag.                                                 |

## Methods

| Name    | Privacy | Description                | Parameters                         | Return | Inherited From |
| ------- | ------- | -------------------------- | ---------------------------------- | ------ | -------------- |
| `open`  | public  | Opens the dialog element.  |                                    | `void` |                |
| `close` | public  | Closes the dialog element. | `result: any, target: HTMLElement` | `any`  |                |

## Events

| Name                | Type                | Description                                                                     | Inherited From |
| ------------------- | ------------------- | ------------------------------------------------------------------------------- | -------------- |
| `willOpen`          | `CustomEvent<void>` | Emits whenever the `sbb-dialog` starts the opening transition. Can be canceled. |                |
| `didOpen`           | `CustomEvent<void>` | Emits whenever the `sbb-dialog` is opened.                                      |                |
| `willClose`         | `CustomEvent<void>` | Emits whenever the `sbb-dialog` begins the closing transition. Can be canceled. |                |
| `didClose`          | `CustomEvent<void>` | Emits whenever the `sbb-dialog` is closed.                                      |                |
| `requestBackAction` | `CustomEvent<void>` | Emits whenever the back button is clicked.                                      |                |

## CSS Properties

| Name                   | Default                      | Description                                                                                                                                                                                           |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sbb-dialog-z-index` | `var(--sbb-overlay-z-index)` | To specify a custom stack order, the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the component is set to `var(--sbb-overlay-z-index)` with a value of `1000`. |

## Slots

| Name           | Description                                                  |
| -------------- | ------------------------------------------------------------ |
|                | Use the unnamed slot to add content to the `sbb-dialog`.     |
| `title`        | Use this slot to provide a title.                            |
| `action-group` | Use this slot to display a `sbb-action-group` in the footer. |
