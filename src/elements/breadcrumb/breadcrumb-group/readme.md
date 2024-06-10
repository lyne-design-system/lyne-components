The `sbb-breadcrumb-group` component is a container for one or more [sbb-breadcrumb](/docs/elements-sbb-breadcrumb-sbb-breadcrumb--docs),
which are meant to represent the hierarchy of visited pages before arriving to the current one.

```html
<sbb-breadcrumb-group aria-label="You are here:">
  <sbb-breadcrumb href="/" icon-name="house-small"></sbb-breadcrumb>
  <sbb-breadcrumb href="/work-with-us"> Work with us </sbb-breadcrumb>
  <sbb-breadcrumb href="/apply" target="_blank"> Apply </sbb-breadcrumb>
</sbb-breadcrumb-group>
```

## Style

If the width of all the nested `sbb-breadcrumb` exceeds the container width,
only the first and the last breadcrumb are displayed, and a new one with the ellipsis symbol appears between them.
Clicking on this `sbb-breadcrumb` will make the ellipsis disappear and will restore the full list
(the action is not reversible).

## Accessibility

It is strongly recommended to place an `aria-label` attribute on the `sbb-breadcrumb-group`, as in the example above,
to describe what context the breadcrumbs have.
Whenever the `sbb-breadcrumb` list within the component is loaded or updated,
the last element of the list receives the attribute `aria-current="page"`.

<!-- Auto Generated Below -->

## Slots

| Name | Description                                            |
| ---- | ------------------------------------------------------ |
|      | Use the unnamed slot to add `sbb-breadcrumb` elements. |
