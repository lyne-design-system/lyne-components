The `sbb-signet` is used as a wrapper for the SBB signet and ensures his aspect ratio and protective room.
To use the component, please define the desired height or width on `sbb-signet`.

```html
<style>
  sbb-signet {
    height: 20px;
  }
</style>
<sbb-signet></sbb-signet>
```

## Style

The aspect ratio of the logo can be changed using the `protectiveRoom` property.
Possible values are `ideal` (default), `minimal` and `none`.

```html
<sbb-signet protective-room="none"></sbb-signet>
```

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute             | Privacy | Type                             | Default   | Description                                                          |
| -------------------- | --------------------- | ------- | -------------------------------- | --------- | -------------------------------------------------------------------- |
| `accessibilityLabel` | `accessibility-label` | public  | `string`                         | `'Logo'`  | Accessibility label which will be forwarded to the inner SVG signet. |
| `protectiveRoom`     | `protective-room`     | public  | `SbbProtectiveRoom \| undefined` | `'ideal'` | Visual protective room around signet.                                |
