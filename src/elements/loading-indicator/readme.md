The `sbb-loading-indicator` is a component which can be used to indicate progress status
or an ongoing activity which require some time to complete.

### Variants

The component has two different variants.

In `window` mode, the component completely covers the parent element, preventing interaction with it.

```html
<sbb-loading-indicator variant="window"></sbb-loading-indicator>
```

While the `circle` mode can be used inline within another component (e.g. button);
in this case the component adjusts its size to the parent font size.

```html
<sbb-button>
  <sbb-loading-indicator slot="icon" variant="circle"></sbb-loading-indicator>
  Click me
</sbb-button>
```

### Style

In `window` mode it's possible to define the `size` of the component, choosing between `s` (default) and `l`.

```html
<sbb-loading-indicator variant="window" size="l"></sbb-loading-indicator>
```

## Accessibility

If the `sbb-loading-indicator` should be announced by screen-readers, use an element with the correct aria attributes
(`aria-live` set to `polite` or `assertive`, and possibly `aria-atomic` and `aria-relevant`)
and then append the `sbb-loading-indicator` on it after giving it the correct `aria-label`.

```html
<div class="loader-container" aria-live="polite">
  <sbb-loading-indicator
    variant="window"
    size="l"
    aria-label="Loading, please wait"
  ></sbb-loading-indicator>
</div>
```

<!-- Auto Generated Below -->

## Properties

| Name      | Attribute | Privacy | Type                                | Default     | Description                                                                                       |
| --------- | --------- | ------- | ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `color`   | `color`   | public  | `'default' \| 'smoke' \| 'white'`   | `'default'` | Color variant.                                                                                    |
| `size`    | `size`    | public  | `'s' \| 'l'`                        | `'s'`       | Size variant, either s or m.                                                                      |
| `variant` | `variant` | public  | `'window' \| 'circle' \| undefined` |             | Variant of the loading indicator; `circle` is meant to be used inline, while `window` as overlay. |
