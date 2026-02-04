// Demo data for ComponentHandlerRegistry examples
// All examples use the same table structure but format different columns

// Unified table structure
const commonTableFields = [
  {
    id: "product-name",
    name: "Product",
    data_path: "products.name",
    data: ["Laptop Pro 15", "Wireless Mouse", "USB-C Cable"],
  },
  {
    id: "product-status",
    name: "Status",
    data_path: "products.status",
    data: ["Running", "Stopped", "Maintenance"],
  },
  {
    id: "product-price",
    name: "Price",
    data_path: "products.price",
    data: [1299.99, 29.99, 19.99],
  },
  {
    id: "product-category",
    name: "Category",
    data_path: "products.category",
    data: ["Electronics", "Accessories", "Cables"],
  },
];

// Example 1: Register by ID — inputDataType "products", formats Product and Status columns
export const registryDemoById = {
  component: "data-view" as const,
  id: "registry-demo-byid",
  inputDataType: "products",
  fields: commonTableFields,
};

// Example 2: Register by Name — inputDataType "servers", formats Status and Price columns
export const registryDemoByName = {
  component: "data-view" as const,
  id: "registry-demo-byname",
  inputDataType: "servers",
  fields: commonTableFields,
};

// Example 3: Register by DataPath — inputDataType "inventory", formats Email and Category columns
export const registryDemoByDataPath = {
  component: "data-view" as const,
  id: "registry-demo-bydatapath",
  inputDataType: "inventory",
  fields: commonTableFields,
};

// Example 4: registerFormatter (multiple criteria) — dataPath + name narrows to Status column only
export const registryDemoMultiMatch = {
  component: "data-view" as const,
  id: "registry-demo-multimatch",
  inputDataType: "context-matcher",
  fields: commonTableFields,
};

// Example 5: Item Click Handler — inputDataType "catalog", same table
export const registryDemoItemClick = {
  component: "data-view" as const,
  id: "registry-demo-itemclick",
  inputDataType: "catalog",
  fields: commonTableFields,
};

// Example 6: Pattern matching (RegExp) — formatters registered with regex for first param
export const registryDemoPatternMatching = {
  component: "data-view" as const,
  id: "registry-demo-pattern",
  inputDataType: "pattern-demo",
  fields: commonTableFields,
};

// Example 7: CSS classes — data-view with unique inputDataType for auto-generated wrapper/cell classes
export const registryDemoCssClasses = {
  component: "data-view" as const,
  id: "registry-demo-css-classes",
  inputDataType: "table-styling",
  fields: commonTableFields,
};

// Example 5: Auto formatters — type is detected from values (empty, datetime, boolean, number, url); other → string. datetime accepts ISO strings and Unix timestamps. No formatter in JSON.
export const registryDemoBuiltInFormatters = {
  component: "data-view" as const,
  id: "registry-demo-builtin-formatters",
  inputDataType: "built-in-formatters",
  fields: [
    {
      id: "col-date",
      name: "Date",
      data_path: "row.date",
      data: ["2025-01-15", "2024-12-31T14:30:00", "2025-06-01"],
    },
    {
      id: "col-timestamp",
      name: "Timestamp",
      data_path: "row.timestamp",
      data: [1735689600, 1704067200000, 1743465600], // seconds, ms, seconds
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
      data: [1234.5, 42_000, 1_000_000],
    },
    {
      id: "col-amount",
      name: "Amount",
      data_path: "row.amount",
      data: [99.99, 1250, 0.5],
    },
    {
      id: "col-link",
      name: "Link",
      data_path: "row.link",
      data: [
        "https://example.com/docs",
        "http://github.com",
        "https://patternfly.org",
      ],
    },
    {
      id: "col-label",
      name: "Label",
      data_path: "row.label",
      data: ["Alpha", "Beta", "Gamma"],
    },
    {
      id: "col-notes",
      name: "Notes",
      data_path: "row.notes",
      data: ["Has value", null, ""],
    },
  ],
};

// Example 8: OneCardWrapper
export const registryDemoOneCard = {
  component: "one-card" as const,
  id: "registry-demo-onecard",
  title: "Server Details",
  inputDataType: "servers",
  fields: [
    {
      id: "server-name",
      name: "Server Name",
      data_path: "servers.name",
      data: ["web-server-01"],
    },
    {
      id: "server-status",
      name: "Status",
      data_path: "servers.status",
      data: ["Running"],
    },
    {
      id: "server-health",
      name: "Health",
      data_path: "servers.health",
      data: ["healthy"],
    },
    {
      id: "server-uptime",
      name: "Uptime",
      data_path: "servers.uptime",
      data: ["45 days"],
    },
  ],
};
