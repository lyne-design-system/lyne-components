The `sbb-pearl-chain-vertical` is a wrapper component for a
[sbb-pearl-chain-vertical-item](/docs/experimental-sbb-pearl-chain-vertical-item--docs) component,
which is projected within an unnamed slot.
Please refer to its documentation for more details.

```json
{
  "lineType": "standard",
  "lineColor": "charcoal",
  "minHeight": "89",
  "hideLine": false,
  "bulletType": "thick-bullet",
  "bulletSize": "small"
}
```

```html
<sbb-pearl-chain-vertical>
  <sbb-pearl-chain-vertical-item pearlChainVerticalItemAttributes={pearlChainVerticalItemAttributes}>
    <div slot="right">content</div>
    <div slot="left">content</div>
  <sbb-pearl-chain-vertical-item>
</sbb-pearl-chain-vertical>
```

<!-- Auto Generated Below -->

## Slots

| Name | Description                                                                 |
| ---- | --------------------------------------------------------------------------- |
|      | The unnamed slot is used for the `sbb-pearl-chain-vertical-item` component. |
