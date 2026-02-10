# Advanced Usage

This document covers advanced features: **Data View** item click handlers and column CSS; and **formatters (Component Handler Registry)**, which work for **data-view**, **one-card**, and **set-of-cards**.

**Contents**

- [Item click handler](#item-click-handler) — make Data View rows clickable (prop or registry)
- [Column formatters and registry](#column-formatters-and-registry) — customize value display in data-view, one-card, and set-of-cards; auto formatters and options
- [CSS classes](#css-classes-for-columns) — style Data View columns by field `id`

---

## Item click handler

You can make rows clickable in two ways:

1. **Prop:** Pass `onItemClick` to `DataViewWrapper` (per-table).
2. **Registry:** Register a handler with `registry.registerItemClick(inputDataType, handler)`. `DataViewWrapper` then resolves the handler by its `inputDataType` when no `onItemClick` prop is passed. Use this to share one handler across multiple tables.

When a handler is set (either way), rows are clickable with hover styling.

```jsx
import DataViewWrapper from "@rhngui/patternfly-react-renderer";

const dataViewConfig = {
  component: "data-view",
  id: "interactive-table",
  fields: [
    {
      name: "Product",
      data_path: "products.name",
      data: ["Laptop", "Mouse", "Keyboard"],
    },
    {
      name: "Price",
      data_path: "products.price",
      data: ["$999", "$25", "$79"],
    },
  ],
};

function App() {
  return (
    <DataViewWrapper
      {...dataViewConfig}
      onItemClick={(event, itemData) => {
        console.log("Item clicked:", itemData);
        // itemData contains all column values as key-value pairs
      }}
    />
  );
}
```

## Column formatters and registry

Customize how cell values are displayed by registering formatters by **field id**, **name**, or **data path** (and optionally by `inputDataType`). Formatters apply to **data-view** (table cells), **one-card** (description list values), and **set-of-cards** (card field values). The resolver looks up by data_path, then id, then name. Use the `input_data_type` config when rendering so the registry can match formatters by context. Types are detected automatically, so you don’t need formatters in field definitions.

### 1. Provider and auto formatters

Wrap your app with `ComponentHandlerRegistryProvider`. When no formatter is found for a field, the resolver uses the **auto formatter** by value type (datetime, boolean → Yes/No, number, url, empty → —).

```jsx
import {
  ComponentHandlerRegistryProvider,
  DataViewWrapper,
} from "@rhngui/patternfly-react-renderer";

function App() {
  return (
    <ComponentHandlerRegistryProvider>
      <DataViewWrapper
        id="my-table"
        inputDataType="built-in-formatters"
        fields={[
          {
            id: "col-date",
            name: "Date",
            data_path: "row.date",
            data: ["2025-01-15", "2024-12-31"],
          },
          {
            id: "col-active",
            name: "Active",
            data_path: "row.active",
            data: [true, false, true],
          },
          {
            id: "col-count",
            name: "Count",
            data_path: "row.count",
            data: [1234.5, 42],
          },
        ]}
      />
    </ComponentHandlerRegistryProvider>
  );
}
```

### 2. Custom formatters

Use the registry (e.g. `registry.registerFormatterById("price", builtInFormatters["currency-usd"])`). Access the registry via `useComponentHandlerRegistry()`.

**Built-in formatters for explicit use:** `currency-usd` and `percent` are not applied automatically. Import `builtInFormatters` from the package and register them for the fields you want (e.g. a "Price" or "Rate" column).

### 3. Auto-formatter options (exclude / overrides)

Pass the `autoFormatterOptions` prop to the provider:

- **exclude** — skip built-in auto formatters for given types; those cells render as `String(value)`.
  - Example: `autoFormatterOptions={{ exclude: ["boolean", "number"] }}`
- **overrides** — replace a built-in formatter for a type.
  - Example: `autoFormatterOptions={{ overrides: { boolean: (v) => (v ? "Y" : "N") } }}`

**Valid option ids:** `datetime`, `boolean`, `number`, `url`, `empty`. In TypeScript, use the exported type `AutoFormatterIdOption`.

More examples and the full API: [Registry Demo](https://redhat-ux.github.io/next-gen-ui-react/).

---

## CSS classes for columns

Each field can have an optional `id`. When set, a CSS class is added to all **data cells** (not headers) in that column:

- **Format:** `field-id-{sanitized-id}`
- **Example:** If `field.id = "user-name"`, cells get class `field-id-user-name`
- **Fallback:** If no `id` is provided, the field `name` is used (sanitized)

```jsx
const dataViewConfig = {
  component: "data-view",
  id: "customizable-table",
  fields: [
    {
      id: "user-name", // CSS class: field-id-user-name
      name: "Name",
      data_path: "users.name",
      data: ["Alice", "Bob", "Carol"],
    },
    {
      id: "user-email", // CSS class: field-id-user-email
      name: "Email",
      data_path: "users.email",
      data: ["alice@example.com", "bob@example.com", "carol@example.com"],
    },
  ],
};

// Then in your CSS:
// .field-id-user-name { color: blue; font-weight: bold; }
// .field-id-user-email { font-style: italic; }
```
